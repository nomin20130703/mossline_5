export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function seg(progress: number, start: number, end: number): number {
  if (end === start) {
    return progress >= end ? 1 : 0;
  }
  return clamp((progress - start) / (end - start));
}

export function easeCubicInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
