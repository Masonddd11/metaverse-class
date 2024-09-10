"use client";

import { sendSignUpEmail } from "@/server-actions/user-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const questionId = searchParams.get("questionId");
  const [state, formAction] = useFormState(sendSignUpEmail, {
    status: "",
    message: "",
    error: "",
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In to Metaverse Classroom</h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email to receive a secure login link. No password required!
        </p>
        {state.status === "error" && (
          <div className="text-red-600 mb-4 text-center">{state.error}</div>
        )}
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" id="email" required className="w-full" />
          </div>
          <Button type="submit" className="w-full">
            Send Login Link
          </Button>
          <input type="hidden" name="questionId" value={questionId || ""} />
        </form>
        {state.status === "success" && (
          <div className="text-green-600 mt-4 text-center">
            Login link sent! Please check your email and click the link to sign in.
          </div>
        )}
        <p className="text-sm text-gray-500 mt-6 text-center">
          You&apos;ll receive an email with a secure link to access the Metaverse Classroom.
          The link is valid for 1 hour and can be used only once.
        </p>
      </div>
    </div>
  );
}
