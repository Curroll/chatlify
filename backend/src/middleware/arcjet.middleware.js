import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arjectProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    // ============================
    // 🔥 1. Arcjet engine denial
    // ============================
    if (decision.isDenied()) {

      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({
          message: "Bot detected. Access denied.",
        });
      }

      return res.status(403).json({
        message: "Request denied by security policy.",
      });
    }

    // ============================
    // 🔥 2. Spoofed Bot Detection
    // ============================
    if (decision.results?.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed Bot Detected",
        message: "Malicious bot activity detected. Access denied.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet protection error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
