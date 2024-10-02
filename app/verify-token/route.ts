import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { lucia } from "@/lib/auth";
import { generateIdFromEntropySize } from "lucia";
import { sendEmail } from "@/lib/email";
import { LuckyDrawEmail } from "@/components/email-templates/LuckyDrawNumberEmail";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const questionId = url.searchParams.get("questionId");

  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const loginToken = await prisma.loginToken.findUnique({
      where: { token },
    });

    if (!loginToken || loginToken.expires < new Date()) {
      return NextResponse.redirect(
        new URL("/signin?error=invalid_token", request.url)
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: loginToken.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: loginToken.email,
        },
      });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    await prisma.loginToken.delete({ where: { id: loginToken.id } });

    const redirectUrl = questionId ? `/questions/${questionId}` : "/questions";
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));

    await sendEmail({
      subject: `Your Lucky Draw Number is ${user.luckyDrawNumber} - CityU Metaverse Class`,
      emailElement: LuckyDrawEmail({
        userEmail: user.email,
        luckyDrawNumber: user.luckyDrawNumber.toString(),
      }),
      toEmail: user.email,
    });

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return response;
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.redirect(
      new URL("/signin?error=server_error", request.url)
    );
  }
}
