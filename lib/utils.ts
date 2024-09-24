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
