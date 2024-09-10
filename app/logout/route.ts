/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import { validateRequest } from "../../lib/auth";
import { signOutUsers } from "@/server-actions/user-actions";
import { redirect } from "next/navigation";

export async function GET(_request: NextRequest) {
  const { session } = await validateRequest();

  if (session) {
    await signOutUsers();
  } else {
    redirect("/");
  }
}
