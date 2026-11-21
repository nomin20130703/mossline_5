export type AnalyticsEventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,14}$/;

let isInitialized = false;
let isEnabled = false;

function getValidatedMeasurementId(): string | null {
  const rawId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (typeof rawId !== "string") {
    return null;
  }
  const trimmed = rawId.trim();
  return GA_MEASUREMENT_ID_PATTERN.test(trimmed) ? trimmed : null;
}

export function initAnalytics(): void {
  if (isInitialized) {
    return;
  }
  isInitialized = true;

  const measurementId = getValidatedMeasurementId();
  if (!measurementId) {
    isEnabled = false;
    return;
  }

  isEnabled = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src^="https://www.googletagmanager.com/gtag/js?id="]`
  );
  if (!existingScript) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      measurementId
    )}`;
    document.head.appendChild(script);
  }
}

export function trackEvent(
  name: string,
  params?: AnalyticsEventParams
): void {
  if (!isEnabled || typeof window.gtag !== "function") {
    return;
  }
  if (params) {
    window.gtag("event", name, params);
  } else {
    window.gtag("event", name);
  }
}

export function trackPageView(): void {
  if (!isEnabled) {
    return;
  }
  trackEvent("page_view", {
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
  });
}
