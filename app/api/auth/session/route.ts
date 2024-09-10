import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/app/libs/auth";

export async function GET(request: NextRequest) {
  const { user, session } = await validateRequest();

  if (!session) {
    return NextResponse.json({ user: null, session: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
    },
    session: {
      id: session.id,
      expiresAt: session.expiresAt,
    },
  });
}
