import * as React from "react";
import { Suspense } from "react";
import AuthPageContent from "@/components/auth/AuthPageContent";

export const metadata = {
  title: "Sign Up · AquaWatchAI KwaliHub",
  description: "Join AquaWatchAI Kwali as a Community Water Scout or request an Institutional Pilot.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030810]" />}>
      <AuthPageContent initialMode="signup" />
    </Suspense>
  );
}
