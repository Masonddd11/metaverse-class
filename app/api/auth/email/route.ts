import { generateLoginToken } from "@/lib/utils";
import prisma from "@/lib/db";
import { AuthEmail } from "@/components/email-templates/AuthEmail";
import { sendEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const { email, username } = await request.json();

  const schema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(31),
  });

  try {
    schema.parse({ email, username });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        message: "Invalid input",
        errors: error.errors,
        status: 400,
      });
    }
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({
      message: "User not found",
      status: 404,
    });
  }

  await sendEmail({
    subject: "Click To Join - Welcome to CityU Metaverse Class",
    emailElement: AuthEmail({ loginToken: await generateLoginToken(email) }),
    toEmail: email,
  });

  return NextResponse.json({
    message: "Email sent",
  });
}
