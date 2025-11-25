import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { ENV } from "./env.js";

const aj = arcjet({
  key: ENV.ARCJET_API_KEY,
  rules: [
    // Protect against injections
    shield({ mode: "LIVE" }),

    // Bot + Spoofed Bot detection
    detectBot({
      mode: "DRY_RUN",
      blockSpoofed: true,
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Googlebot, Bingbot, etc.
        // "CATEGORY:MONITOR",
        // "CATEGORY:PREVIEW",
      ],
    }),

    // Rate Limiting
    slidingWindow({
      mode: "LIVE",
      max: 100,
      interval: 60,
    }),
  ],
});

export default aj;
