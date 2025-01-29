import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        afterSignUpUrl="/onboarding"  // This redirects to onboarding after signup
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-md",
          },
        }}
      />
    </div>
  );
}