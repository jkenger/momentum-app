// app/(auth)/login/page.tsx
import { AuthForm } from "@/components/auth/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Momentum",
  description: "Login to your Momentum account",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
