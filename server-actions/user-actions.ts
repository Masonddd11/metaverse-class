/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { ActionResult } from "next/dist/server/app-render/types";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { AuthEmail } from "@/components/email-templates/AuthEmail";
import { generateLoginToken } from "@/lib/auth";

export async function sendSignUpEmail(
  state: any,
  formData: FormData
): Promise<ActionResult> {
  try {
    const schema = z.object({
      email: z.string().email(),
      questionId: z.string().nullable(),
    });

    const parse = schema.parse({
      email: formData.get("email"),
      questionId: formData.get("questionId"),
    });

    const { email, questionId } = parse;

    const loginToken = await generateLoginToken(email);

    await sendEmail({
      subject: "Log in to Our Metaverse Classroom",
      emailElement: AuthEmail({
        loginToken,
        questionId: questionId || undefined,
      }),
      toEmail: email,
    });
    return {
      status: "success",
      message: "Please check your email for a login link",
      error: "",
    };
  } catch (error) {
    console.error("Error in sendSignUpEmail:", error);
    return {
      status: "error",
      message: "Failed to send login email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function signOutUsers(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return redirect("/");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/signin");
}
