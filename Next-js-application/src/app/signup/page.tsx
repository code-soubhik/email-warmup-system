"use client";

import { useState } from "react";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { sendOtpAction, signupAction } from "@/_actions/auth";

export default function SignupPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ── FORM 1: Send OTP ───────────────────────────────── */
  async function handleSendOtp(formData: FormData) {
    setError("");
    const passwd = formData.get("password") as string;
    const confirmPasswd = formData.get("confirm") as string;
    if (passwd !== confirmPasswd) { setError("Passwords do not match."); return; }
    const result = await sendOtpAction({ email: formData.get("email") as string });
    if (result?.error) { setError(result.error); return; }
    setEmail(formData.get("email") as string);
    setPassword(passwd);
    setOtpSent(true);
  }

  /* ── FORM 2: Verify OTP + Create account ────────────── */
  async function handleSignup(formData: FormData) {
    setError("");
    const otp = formData.get("otp") as string;
    if (!otp || otp.length !== 6) { setError("Enter the 6-digit code."); return; }
    const result = await signupAction(formData);
    if (result?.error) { setError(result.error); return; }
  }

  /* ── Resend ──────────────────────────────────────────── */
  async function handleResend() {
    setResending(true);
    setResent(false);
    setError("");
    const result = await sendOtpAction({ email });
    setResending(false);
    if (result?.error) { setError(result.error); return; }
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080a0f]">

      {/* left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 h-full flex-col justify-between p-14 border-r border-white/[0.07] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
        <div className="pointer-events-none absolute -right-40 bottom-1/3 w-[500px] h-[500px] rounded-full bg-amber-500/[0.07] blur-[120px]" />

        <p className="relative z-10 text-xl font-serif text-[#e8e6e1]">
          EmailWarmup
        </p>

        <div className="relative z-10 space-y-5">
          <p className="text-3xl font-serif text-[#e8e6e1]/90 leading-snug max-w-xs">
            Start building your sender <em className="italic text-amber-400">reputation</em> today.
          </p>
          <ul className="space-y-3">
            {["Free forever on the starter plan", "No credit card required", "Connect Gmail in 60 seconds"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 ring-1 ring-amber-400/30 text-amber-400 text-[10px]">✓</span>
                <span className="text-sm text-white/50 font-light">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative mt-4 z-10 text-[10px] tracking-[0.2em] uppercase text-white/20 font-mono">
          Secure · Private · Automatic
        </p>
      </div>

      {/* right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 h-full">

        {/* mobile wordmark */}
        <p className="lg:hidden text-xl font-serif text-[#e8e6e1] mb-10">
          EmailWarmup
        </p>

        <div className="w-full max-w-sm space-y-8">

          {!otpSent ? (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-serif text-[#e8e6e1] tracking-tight">Create account</h1>
                <p className="text-xs font-mono tracking-widest uppercase text-white/30">Get started in seconds</p>
              </div>

              {/* ── FORM 1 ── */}
              <form action={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-white/40">Email</label>
                  <Input
                    name="email"
                    placeholder="you@example.com"
                    type="email"
                    required
                    className="h-11 bg-white/4 border-white/10 text-[#e8e6e1] placeholder:text-white/20 focus-visible:border-amber-400 focus-visible:ring-0 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-white/40">Password</label>
                  <Input
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    required
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Min 8 chars, one uppercase, one number"
                    className="h-11 bg-white/4 border-white/10 text-[#e8e6e1] placeholder:text-white/20 focus-visible:border-amber-400 focus-visible:ring-0 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-white/40">Confirm password</label>
                  <Input
                    name="confirm"
                    placeholder="••••••••"
                    type="password"
                    required
                    className="h-11 bg-white/4 border-white/10 text-[#e8e6e1] placeholder:text-white/20 focus-visible:border-amber-400 focus-visible:ring-0 rounded-md"
                  />
                </div>

                {error && <p className="text-sm text-destructive text-center">{error}</p>}

                <Button type="submit" className="w-full h-11 bg-amber-400 text-[#080a0f] hover:bg-amber-300 font-mono text-[11px] tracking-widest uppercase rounded-md">
                  Create account
                </Button>

                <p className="text-sm text-center text-white/30 font-mono">
                  Already have an account?{" "}
                  <a href="/login" className="text-amber-400/70 hover:text-amber-400 transition-colors underline underline-offset-4">Login</a>
                </p>
              </form>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-serif text-[#e8e6e1] tracking-tight">Verify your email</h1>
                <p className="text-xs font-mono tracking-widest uppercase text-white/30">
                  Code sent to <span className="text-amber-400/70 lowercase">{email}</span>
                </p>
              </div>

              {/* ── FORM 2 ── */}
              <form action={handleSignup} className="space-y-4">
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="password" value={password} />

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-white/40">6-digit code</label>
                  <Input
                    name="otp"
                    placeholder="000000"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    pattern="\d{6}"
                    required
                    autoFocus
                    autoComplete="one-time-code"
                    className="h-11 bg-white/4 border-white/10 text-[#e8e6e1] placeholder:text-white/20 focus-visible:border-amber-400 focus-visible:ring-0 rounded-md text-center tracking-[0.5em] text-lg"
                  />
                </div>

                {resent && (
                  <p className="text-sm text-center text-green-500">Code resent successfully.</p>
                )}

                {error && <p className="text-sm text-destructive text-center">{error}</p>}

                <Button type="submit" className="w-full h-11 bg-amber-400 text-[#080a0f] hover:bg-amber-300 font-mono text-[11px] tracking-widest uppercase rounded-md">
                  Verify & Create account
                </Button>

                <div className="flex items-center justify-between text-xs font-mono text-white/30">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="hover:text-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed underline underline-offset-4"
                  >
                    {resending ? "Resending..." : "Resend code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setError(""); }}
                    className="hover:text-white/60 transition-colors underline underline-offset-4"
                  >
                    Wrong email?
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}