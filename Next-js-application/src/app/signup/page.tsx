"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendOtp, signup } from "@/actions/auth";

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

    const passwd  = formData.get("password") as string;
    const confirmPasswd = formData.get("confirm")  as string;

    if (passwd !== confirmPasswd) {
      setError("Passwords do not match.");
      return;
    }

    const result = await sendOtp({ email: formData.get("email") as string });
    if (result?.error) { setError(result.error); return; }

    setEmail(formData.get("email") as string);
    setPassword(passwd);
    setOtpSent(true);
  }

  /* ── FORM 2: Verify OTP + Create account ────────────── */

  async function handleSignup(formData: FormData) {
    setError("");

    const otp = formData.get("otp") as string;
    if (!otp || otp.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    const result = await signup(formData);
    if (result?.error) { setError(result.error); return; }
    // server action redirects on success
  }

  /* ── Resend ──────────────────────────────────────────── */

  async function handleResend() {
    setResending(true);
    setResent(false);
    setError("");
    const result = await sendOtp({ email });
    setResending(false);
    if (result?.error) { setError(result.error); return; }
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-md p-8 border rounded-xl shadow space-y-6">

        <h1 className="text-2xl font-semibold text-center">Create account</h1>

        {!otpSent ? (

          /* ════════════════════════════════════
             FORM 1 — Email + Password
          ════════════════════════════════════ */
          <form action={handleSendOtp} className="space-y-4">
            <Input
              name="email"
              placeholder="Email"
              type="email"
              required
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              required
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Min 8 chars, one uppercase, one number"
            />
            <Input
              name="confirm"
              placeholder="Confirm password"
              type="password"
              required
            />

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button className="w-full" type="submit">
              Create account
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="underline">Login</a>
            </p>
          </form>

        ) : (

          /* ════════════════════════════════════
             FORM 2 — OTP Verify
          ════════════════════════════════════ */
          <form action={handleSignup} className="space-y-4">
            {/* carry email for account creation */}
            <input type="hidden" name="email"    value={email} />
            {/* carry password for account creation */}
            <input type="hidden" name="password"    value={password} />

            <p className="text-sm text-center text-muted-foreground">
              OTP sent to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>

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
              className="text-center tracking-[0.5em] text-lg"
            />

            {resent && (
              <p className="text-sm text-center text-green-600 dark:text-green-400">
                OTP resent.
              </p>
            )}

            <p className="text-sm text-center text-muted-foreground">
              Didn't receive?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? "Resending..." : "Resend"}
              </button>
            </p>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button className="w-full" type="submit">
              Verify & Create account
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Wrong email?{" "}
              <button
                type="button"
                className="underline"
                onClick={() => { setOtpSent(false); setError(""); }}
              >
                Go back
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}