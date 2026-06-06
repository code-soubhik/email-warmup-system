"use client";

import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, { error: "" });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080a0f]">

      {/* left decorative panel  hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 h-full flex-col justify-between p-14 border-r border-white/[0.07] relative overflow-hidden">
        {/* grid */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
        {/* glow */}
        <div className="pointer-events-none absolute -left-40 top-1/3 w-[500px] h-[500px] rounded-full bg-amber-500/[0.07] blur-[120px]" />

        {/* wordmark */}
        <p className="relative z-10 text-xl font-serif text-[#e8e6e1]">
          EmailWarmup
        </p>

        {/* quote */}
        <div className="relative z-10 space-y-5">
          <p className="text-3xl font-serif text-[#e8e6e1]/90 leading-snug max-w-xs">
            "Your emails deserve to land in the{" "}
            <em className="italic text-amber-400">inbox.</em>"
          </p>
        </div>

        <p className="relative z-10 text-[10px] tracking-[0.2em] uppercase text-white/20 font-mono">
          Secure · Private · Automatic
        </p>
      </div>

      {/* right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 h-full">

        {/* mobile wordmark */}
        <p className="lg:hidden text-xl font-serif text-[#e8e6e1] mb-10">
          EmailWarmup<span className="text-amber-400">.</span>
        </p>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-serif text-[#e8e6e1] tracking-tight">Welcome back</h1>
            <p className="text-xs font-mono tracking-widest uppercase text-white/30">Login to continue</p>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-widest uppercase text-white/40">Email</label>
              <Input
                name="email"
                placeholder="you@example.com"
                type="email"
                required
                className="h-11 bg-white/[0.04] border-white/10 text-[#e8e6e1] placeholder:text-white/20 focus-visible:border-amber-400 focus-visible:ring-0 rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono tracking-widest uppercase text-white/40">Password</label>
                {/* <a href="/forgot-password" className="text-[10px] font-mono text-amber-400/60 hover:text-amber-400 transition-colors">Forgot?</a> */}
              </div>
              <Input
                name="password"
                placeholder="••••••••"
                type="password"
                required
                className="h-11 bg-white/[0.04] border-white/10 text-[#e8e6e1] placeholder:text-white/20 focus-visible:border-amber-400 focus-visible:ring-0 rounded-md"
              />
            </div>

            {state.error && (
              <p className="text-sm text-destructive text-center">{state.error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-amber-400 text-[#080a0f] hover:bg-amber-300 font-mono text-[11px] tracking-widest uppercase rounded-md transition-all"
            >
              Login
            </Button>

            <p className="text-sm text-center text-white/30 font-mono">
              No account?{" "}
              <a href="/signup" className="text-amber-400/70 hover:text-amber-400 transition-colors underline-offset-4 underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}