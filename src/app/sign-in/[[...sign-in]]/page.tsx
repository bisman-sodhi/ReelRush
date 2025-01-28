import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
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