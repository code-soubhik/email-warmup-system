import crypto from "crypto";

const key = Buffer.from(
  process.env.ENCRYPTION_KEY!,
  "hex"
);

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);

  const cipher =
    crypto.createCipheriv(
      "aes-256-gcm",
      key,
      iv
    );

  let encrypted =
    cipher.update(text, "utf8", "hex");

  encrypted += cipher.final("hex");

  const tag =
    cipher.getAuthTag().toString("hex");

  return JSON.stringify({
    iv: iv.toString("hex"),
    tag,
    encrypted,
  });
}