import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        afterSignUpUrl="/onboarding"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-md",
            formButtonPrimary: "bg-black hover:bg-gray-800",
            footerActionLink: "text-black hover:text-gray-800",
            formFieldInput: "text-black",
            formFieldLabel: "text-black",
            headerTitle: "text-black",
            headerSubtitle: "text-gray-600",
            socialButtonsBlockButton: "text-black border-black",
            dividerLine: "bg-gray-300",
            dividerText: "text-gray-500",
          }
        }}
      />
    </div>
  );
}