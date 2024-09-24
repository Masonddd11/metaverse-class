import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import prisma from "./db";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function generateRandomString(length: number): string {
  return crypto.randomBytes(length).toString("hex");
}

export function encryptEmail(email: string): string {
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || "", "salt", 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(email, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + encrypted;
}

export function decryptEmail(encryptedEmail: string): string {
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || "", "salt", 32);
  const iv = Buffer.from(encryptedEmail.slice(0, 32), "hex");
  const encrypted = encryptedEmail.slice(32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export async function generateLoginToken(email: string): Promise<string> {
  const token = generateRandomString(20);
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  const user = await prisma.user.findUnique({ where: { email } });

  await prisma.loginToken.create({
    data: {
      token,
      email,
      expires,
    },
  });

  return token;
}
