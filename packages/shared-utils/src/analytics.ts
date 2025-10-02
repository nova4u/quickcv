const TRACKING_ID = "79c8074f-930a-4da1-8510-c9833e9e9f63";

export const ANALYTICS_SCRIPT = {
  src: "https://cloud.umami.is/script.js",
  "data-website-id": TRACKING_ID,
  defer: true,
};

export function trackEvent(eventName: string) {
  return {
    "data-umami-event": eventName,
  };
}

