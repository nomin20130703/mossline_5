import { useCallback, useEffect, useRef } from "react";

const TARGET_FPS = 24;
const GRAB_WIDTH = 1600;
const GRAB_HEIGHT = 900;

interface VideoFrameMetadata {
  mediaTime: number;
}

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (now: number, metadata: VideoFrameMetadata) => void
  ) => number;
};

export interface VideoFrameCacheController {
  setWantedProgress: (videoProgress: number) => void;
  getShownFrameIndex: () => number;
  resizeCanvas: () => void;
}

export function useVideoFrameCache(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
): VideoFrameCacheController {
  const frameCountRef = useRef<number>(121);
  const framesRef = useRef<(Blob | null)[]>([]);
  const wantFrameRef = useRef<number>(0);
  const shownFrameRef = useRef<number>(-1);
  const isBusyRef = useRef<boolean>(false);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const nextWidth = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const nextHeight = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      shownFrameRef.current = -1;
    }
  }, [canvasRef]);

  const findNearestFrame = useCallback((target: number): number => {
    const frames = framesRef.current;
    const total = frames.length;
    if (total === 0) {
      return -1;
    }
    const clampedTarget = Math.max(0, Math.min(total - 1, target));
    if (frames[clampedTarget]) {
      return clampedTarget;
    }
    for (let offset = 1; offset < total; offset++) {
      const lower = clampedTarget - offset;
      if (lower >= 0 && frames[lower]) {
        return lower;
      }
      const upper = clampedTarget + offset;
      if (upper < total && frames[upper]) {
        return upper;
      }
    }
    return -1;
  }, []);

  const drawWantedFrame = useCallback(() => {
    if (isBusyRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const nearestIndex = findNearestFrame(wantFrameRef.current);
    if (nearestIndex < 0 || nearestIndex === shownFrameRef.current) {
      return;
    }
    const blob = framesRef.current[nearestIndex];
    if (!blob) {
      return;
    }

    isBusyRef.current = true;
    createImageBitmap(blob)
      .then((bitmap) => {
        const ctx = canvas.getContext("2d");
        if (ctx && canvas.width > 0 && canvas.height > 0) {
          const cw = canvas.width;
          const ch = canvas.height;
          const bw = bitmap.width;
          const bh = bitmap.height;
          const scale = Math.max(cw / bw, ch / bh);
          const drawWidth = bw * scale;
          const drawHeight = bh * scale;
          const drawX = (cw - drawWidth) / 2;
          const drawY = (ch - drawHeight) / 2;
          ctx.drawImage(bitmap, drawX, drawY, drawWidth, drawHeight);
          shownFrameRef.current = nearestIndex;
        }
        bitmap.close();
      })
      .catch(() => {
        // Ignore transient decode errors while frames stream in
      })
      .finally(() => {
        isBusyRef.current = false;
        const updatedNearest = findNearestFrame(wantFrameRef.current);
        if (updatedNearest >= 0 && updatedNearest !== shownFrameRef.current) {
          drawWantedFrame();
        }
      });
  }, [canvasRef, findNearestFrame]);

  useEffect(() => {
    const video = videoRef.current as VideoWithFrameCallback | null;
    if (!video) {
      return;
    }

    let isDisposed = false;
    let isInitialized = false;
    const grabCanvas = document.createElement("canvas");
    grabCanvas.width = GRAB_WIDTH;
    grabCanvas.height = GRAB_HEIGHT;
    const grabCtx = grabCanvas.getContext("2d");

    const captureFrame = (index: number, quality: number, onCaptured?: () => void) => {
      if (!grabCtx || isDisposed || framesRef.current[index]) {
        onCaptured?.();
        return;
      }
      try {
        grabCtx.drawImage(video, 0, 0, GRAB_WIDTH, GRAB_HEIGHT);
        grabCanvas.toBlob(
          (blob) => {
            if (isDisposed || !blob) {
              onCaptured?.();
              return;
            }
            framesRef.current[index] = blob;
            if (
              index === wantFrameRef.current ||
              shownFrameRef.current < 0 ||
              index === 0
            ) {
              drawWantedFrame();
            }
            onCaptured?.();
          },
          "image/jpeg",
          quality
        );
      } catch {
        onCaptured?.();
      }
    };

    const startCaching = () => {
      if (isInitialized || isDisposed || !Number.isFinite(video.duration)) {
        return;
      }
      isInitialized = true;
      const totalFrames = Math.max(2, Math.round(video.duration * TARGET_FPS));
      frameCountRef.current = totalFrames;
      framesRef.current = new Array<Blob | null>(totalFrames).fill(null);

      // Frame 0 is needed immediately for the seamless hero hand-off
      captureFrame(0, 0.9);

      if (typeof video.requestVideoFrameCallback === "function") {
        const handleVideoFrame = (_now: number, metadata: VideoFrameMetadata) => {
          if (isDisposed) {
            return;
          }
          const frameIndex = Math.min(
            totalFrames - 1,
            Math.round(metadata.mediaTime * TARGET_FPS)
          );
          if (frameIndex > 0 && !framesRef.current[frameIndex]) {
            captureFrame(frameIndex, 0.86);
          }
          if (!video.ended) {
            video.requestVideoFrameCallback?.(handleVideoFrame);
          }
        };
        video.requestVideoFrameCallback(handleVideoFrame);
        video.play().catch(() => {
          // Fallback to seeked stepping if autoplay is blocked
          runSeekedFallback(totalFrames);
        });
      } else {
        runSeekedFallback(totalFrames);
      }
    };

    const runSeekedFallback = (totalFrames: number) => {
      let stepIndex = 1;
      const handleSeeked = () => {
        if (isDisposed) {
          return;
        }
        captureFrame(stepIndex, 0.86, () => {
          stepIndex += 1;
          if (stepIndex < totalFrames && !isDisposed) {
            video.currentTime = Math.min(
              stepIndex / TARGET_FPS,
              Math.max(0, video.duration - 0.01)
            );
          } else {
            video.removeEventListener("seeked", handleSeeked);
          }
        });
      };
      video.addEventListener("seeked", handleSeeked);
      if (totalFrames > 1) {
        video.currentTime = Math.min(
          1 / TARGET_FPS,
          Math.max(0, video.duration - 0.01)
        );
      }
    };

    resizeCanvas();
    if (video.readyState >= 2) {
      startCaching();
    } else {
      video.addEventListener("loadeddata", startCaching);
    }

    return () => {
      isDisposed = true;
      video.removeEventListener("loadeddata", startCaching);
    };
  }, [drawWantedFrame, resizeCanvas, videoRef]);

  const setWantedProgress = useCallback(
    (videoProgress: number) => {
      const nextWant = Math.round(videoProgress * (frameCountRef.current - 1));
      if (nextWant !== wantFrameRef.current) {
        wantFrameRef.current = nextWant;
      }
      drawWantedFrame();
    },
    [drawWantedFrame]
  );

  const getShownFrameIndex = useCallback(() => {
    return shownFrameRef.current;
  }, []);

  return {
    setWantedProgress,
    getShownFrameIndex,
    resizeCanvas,
  };
}
