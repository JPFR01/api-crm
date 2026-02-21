import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const metaSignatureMiddleware = (
  req: Request & { rawBody?: string },
  res: Response,
  next: NextFunction
): void | Response => {
  const signatureKey = process.env.META_APP_SECRET;

  if (!signatureKey) {
    console.error("META_APP_SECRET is missing.");
    return res.status(500).json({ error: "Internal Server Error" });
  }

  const signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    return res.status(401).json({ error: "Missing x-hub-signature-256 header." });
  }

  const rawBody = req.rawBody;

  if (!rawBody) {
    console.error(
      "req.rawBody is undefined. Make sure the express json body parser is configured to save the raw buffer."
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }

  const expectedSignature = `sha256=${crypto
    .createHmac("sha256", signatureKey)
    .update(rawBody)
    .digest("hex")}`;

  // Use a constant time comparison to prevent timing attacks
  const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
  const receivedBuffer = Buffer.from(signature as string, "utf-8");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return res.status(401).json({ error: "Invalid signature length." });
  }

  const isValid = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid signature." });
  }

  next();
};
