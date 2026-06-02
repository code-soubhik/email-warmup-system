"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import WarmupChart from "@/components/WarmupChart";
import Label from "@/components/Label";
import { useSessionAuth } from "@/providers/SessionProvider";
import { logoutAction } from "@/actions/auth";

export default function LandingPage() {
  const { session } = useSessionAuth();
  const isAuth = session.userId !== null;

  return (
    <div className="bg-[#080a0f] text-[#e8e6e1] min-h-screen overflow-x-hidden">

      {/* ══ NAV ══════════════════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 border-b border-white/[0.07] bg-[#080a0f]/80 backdrop-blur-xl">
        <a href="/" className="text-xl tracking-tight text-[#e8e6e1] no-underline font-serif">
          EmailWarmup
        </a>

        <div className="flex items-center gap-3">
          {isAuth ? (
            <>
              <Button asChild variant="ghost" size="sm" className="font-mono text-[11px] tracking-widest uppercase">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button
                size="sm"
                className="bg-amber-400 text-[#080a0f] hover:bg-amber-300 font-mono text-[11px] tracking-widest uppercase rounded-sm"
                onClick={logoutAction}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-white/40 hover:text-white font-mono text-[11px] tracking-widest uppercase">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-amber-400 text-[#080a0f] hover:bg-amber-300 font-mono text-[11px] tracking-widest uppercase rounded-sm">
                <Link href="/signup">Start free</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%,black 30%,transparent 80%)",
          }} />
        <div className="pointer-events-none absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-amber-500/[0.06] blur-[100px]" />

        <Badge variant="outline"
          className="mb-10 gap-2 px-4 py-1.5 rounded-full border-amber-400/30 bg-amber-400/10 text-amber-400 font-mono text-[10px] tracking-[0.12em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Gmail OAuth2 — No SMTP required
        </Badge>

        <h1 className="text-5xl md:text-7xl lg:text-[96px] leading-none tracking-[-0.03em] text-[#e8e6e1] max-w-4xl mb-5 font-serif">
          Your emails deserve<br />
          to land in the{" "}
          <em className="text-amber-400 italic font-serif">inbox.</em>
        </h1>

        <p className="text-base md:text-lg text-white/40 max-w-md leading-relaxed font-light mb-12">
          MailWarm simulates real human conversations to build your sender reputation — gradually, safely, automatically.
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Button asChild className="h-12 px-8 bg-amber-400 text-[#080a0f] hover:bg-amber-300 font-mono text-[11px] tracking-widest uppercase rounded-sm hover:-translate-y-px transition-all">
            <Link href="/emails">Start warming — it's free</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 px-8 border-white/[0.07] bg-transparent text-white/40 hover:bg-white/[0.03] hover:text-white/70 font-mono text-[11px] tracking-widest uppercase rounded-sm">
            <a href="#how">See how it works</a>
          </Button>
        </div>

        <Card className="mt-16 border-white/[0.07] bg-[#0e1117]/60 backdrop-blur">
          <CardContent className="flex items-center gap-8 md:gap-10 px-8 md:px-10 py-6 flex-wrap justify-center">
            {[
              { num: "98", suffix: "%", label: "Inbox rate" },
              { num: "14", suffix: "d", label: "Avg. warmup time" },
              { num: "0", suffix: "", label: "SMTP config" },
              { num: "∞", suffix: "", label: "Threads simulated" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-8 md:gap-10">
                {i > 0 && <Separator orientation="vertical" className="hidden md:block h-10 bg-white/[0.07]" />}
                <div className="text-center">
                  <p className="text-3xl leading-none mb-1 font-serif text-[#e8e6e1]">
                    {s.num}<span className="text-amber-400">{s.suffix}</span>
                  </p>
                  <p className="text-[10px] tracking-widest uppercase text-white/30 font-mono">{s.label}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════ */}
      <section id="how" className="border-t border-white/[0.07] px-6 py-24 max-w-5xl mx-auto">
        <Label>How it works</Label>
        <h2 className="text-4xl md:text-5xl leading-tight tracking-[-0.02em] text-[#e8e6e1] mb-4 font-serif">
          Three steps to a <em className="italic text-amber-400 font-serif">trusted</em> inbox.
        </h2>
        <p className="text-sm text-white/40 max-w-sm leading-relaxed font-light mb-14">
          No technical setup. No SMTP. Just connect your Gmail and let MailWarm do the rest.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.07] border border-white/[0.07] rounded-xl overflow-hidden">
          {[
            { num: "01", icon: "🔗", title: "Connect Gmail", body: "Authorize via Google OAuth2. No passwords stored — ever. Tokens AES-256 encrypted at rest." },
            { num: "02", icon: "⚙️", title: "Configure warmup", body: "Set your email target, send interval, and reply window. Ramp-up is handled automatically." },
            { num: "03", icon: "📈", title: "Watch it grow", body: "Live dashboard shows every email, reply, and thread. Health score updates in real time." },
          ].map((s) => (
            <div key={s.num} className="p-8 md:p-10 bg-[#0e1117] hover:bg-[#111620] transition-colors">
              <p className="text-[10px] tracking-widest uppercase text-amber-400/60 font-mono mb-5">{s.num}</p>
              <span className="text-2xl block mb-4">{s.icon}</span>
              <h3 className="text-lg tracking-tight text-[#e8e6e1] mb-2 font-serif">{s.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-light">{s.body}</p>
            </div>
          ))}
        </div>

        <WarmupChart />
      </section>

      {/* ══ FEATURES ═════════════════════════════════════════ */}
      <section id="features" className="border-t border-white/[0.07] px-6 py-24 max-w-5xl mx-auto">
        <Label>Features</Label>
        <h2 className="text-4xl md:text-5xl leading-tight tracking-[-0.02em] text-[#e8e6e1] mb-14 font-serif">
          Everything your<br />reputation needs.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-white/[0.07] rounded-xl overflow-hidden bg-white/[0.07]">
          {[
            { icon: "🧠", title: "Human-like replies", body: "Varied templates, randomised send times and reply delays. Indistinguishable from real conversations." },
            { icon: "⏱️", title: "Chained scheduling", body: "Each sent email spawns the next with a random delay — no cron jobs, no missed windows, no bulk bursts." },
            { icon: "🔐", title: "OAuth2 only", body: "Gmail connected via Google OAuth2. Access tokens auto-refresh. Zero SMTP credentials stored." },
            { icon: "📡", title: "Live dashboard", body: "WebSocket-powered real-time feed. Watch emails send and replies arrive as they happen." },
            { icon: "🧵", title: "Thread depth tracking", body: "Replies stay in-thread with proper headers. Depth tracked per conversation for authentic signals." },
            { icon: "🛡️", title: "Anti-spam by design", body: "Send windows, volume caps, reply probability, and jitter baked in. Designed to look completely natural." },
          ].map((f) => (
            <div key={f.title} className="p-8 bg-[#0e1117] hover:bg-[#111620] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-lg mb-5">
                {f.icon}
              </div>
              <h3 className="text-base tracking-tight text-[#e8e6e1] mb-2 font-serif">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-light">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PRICING ══════════════════════════════════════════ */}
      <section id="pricing" className="border-t border-white/[0.07] px-6 py-24 max-w-5xl mx-auto">
        <Label>Pricing</Label>
        <h2 className="text-4xl md:text-5xl leading-tight tracking-[-0.02em] text-[#e8e6e1] mb-4 font-serif">
          Simple, honest <em className="italic text-amber-400 font-serif">pricing.</em>
        </h2>
        <p className="text-sm text-white/40 mb-14 font-light">No usage surprises. Pay for accounts, not emails.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              tier: "Starter", price: "0", period: "forever free", featured: false,
              features: ["1 Gmail account", "20 emails / day", "Basic analytics", "Community support"],
              cta: "Get started",
            },
            {
              tier: "Pro", price: "19", period: "per month", featured: true,
              features: ["5 Gmail accounts", "100 emails / day", "Live dashboard", "Priority support", "Custom intervals"],
              cta: "Start free trial",
            },
            {
              tier: "Team", price: "49", period: "per month", featured: false,
              features: ["Unlimited accounts", "Unlimited emails", "Full analytics", "Dedicated support", "API access"],
              cta: "Contact us",
            },
          ].map((p) => (
            <Card key={p.tier}
              className={`relative border rounded-xl transition-colors ${p.featured
                ? "border-amber-400/40 bg-gradient-to-b from-[#111620] to-[#0e1117]"
                : "border-white/[0.07] bg-[#0e1117] hover:border-white/[0.14]"
                }`}>
              {p.featured && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-[#080a0f] text-[9px] tracking-widest uppercase font-bold rounded-b-lg font-mono">
                  Most popular
                </div>
              )}
              <CardContent className="p-8">
                <p className="text-[10px] tracking-widest uppercase text-white/30 mb-3 font-mono">{p.tier}</p>
                <div className="flex items-end gap-0.5 mb-1">
                  <span className="text-sm text-white/40 mb-1.5 font-light">$</span>
                  <span className="text-5xl leading-none tracking-tight text-[#e8e6e1] font-serif">{p.price}</span>
                </div>
                <p className="text-[10px] tracking-widest text-white/30 mb-6 font-mono">{p.period}</p>
                <Separator className="bg-white/[0.07] mb-6" />
                <ul className="space-y-2.5 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/50 font-light">
                      <span className="text-amber-400 text-xs">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Button asChild
                  className={`w-full font-mono text-[10px] tracking-widest uppercase rounded-sm h-10 ${p.featured
                    ? "bg-amber-400 text-[#080a0f] hover:bg-amber-300"
                    : "bg-transparent border border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/20"
                    }`}
                  variant={p.featured ? "default" : "outline"}>
                  <Link href="/signup">{p.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ═══════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-6 mb-24">
        <div className="relative overflow-hidden text-center px-8 py-20 border border-amber-400/20 rounded-2xl bg-gradient-to-br from-[#0e1117] via-[#111620] to-[#0e1117]">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-amber-500/[0.05] blur-[80px]" />
          <h2 className="relative text-4xl md:text-5xl leading-tight tracking-[-0.02em] text-[#e8e6e1] mb-4 font-serif">
            Stop landing in <em className="italic text-amber-400 font-serif">spam.</em>
          </h2>
          <p className="relative text-sm text-white/40 mb-10 font-light">
            Join thousands of senders who trust MailWarm to build their reputation.
          </p>
          <div className="relative flex items-center gap-4 justify-center flex-wrap">
            <Button asChild className="h-12 px-8 bg-amber-400 text-[#080a0f] hover:bg-amber-300 font-mono text-[11px] tracking-widest uppercase rounded-sm hover:-translate-y-px transition-all">
              <Link href="/signup">Start warming for free</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 px-8 border-white/[0.07] bg-transparent text-white/40 hover:bg-white/[0.03] hover:text-white/70 font-mono text-[11px] tracking-widest uppercase rounded-sm">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.07] px-6 md:px-12 py-8 flex items-center justify-between flex-wrap gap-4">
        <a href="/" className="text-base text-white/40 no-underline font-serif">
          MailWarm
        </a>
        <span className="text-[10px] tracking-widest text-white/20 font-mono">© 2025 MailWarm. All rights reserved.</span>
      </footer>

    </div>
  );
}