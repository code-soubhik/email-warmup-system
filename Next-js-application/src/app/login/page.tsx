"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, formAction] = useActionState(login, { error: "" });

  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-md p-8 border rounded-xl shadow space-y-6">

        <h1 className="text-2xl font-semibold text-center">Login</h1>

        <form action={formAction} className="space-y-4">
          <Input name="email" placeholder="Email" type="email" required />
          <Input name="password" placeholder="Password" type="password" required />

          <div className="flex justify-end text-sm">
            {/* <a href="/forgot-password" className="hover:underline">Forgot password?</a> */}
          </div>

          {state.error && (
            <p className="text-sm text-destructive text-center">{state.error}</p>
          )}

          <Button className="w-full" type="submit">Login</Button>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <a href="/signup" className="underline">Sign up</a>
          </p>
        </form>

      </div>
    </div>
  );
}