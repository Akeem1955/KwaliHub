import * as React from "react";
import { Suspense } from "react";
import AuthPageContent from "@/components/auth/AuthPageContent";

export const metadata = {
  title: "Sign In · AquaWatchAI KwaliHub",
  description: "Sign in to AquaWatchAI Kwali as a Community Water Scout or Institutional Partner.",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030810]" />}>
      <AuthPageContent initialMode="signin" />
    </Suspense>
  );
}
