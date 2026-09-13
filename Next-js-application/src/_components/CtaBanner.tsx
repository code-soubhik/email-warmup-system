import Link from "next/link";
import { Button } from "@/_components/ui/button";
import { logoutAction } from "@/_actions/auth";
import { useSessionAuth } from "@/_providers/SessionProvider";

const CtaBanner = () => {
    const { isAuth } = useSessionAuth();

    if(isAuth) return null;

    return (
        <>
            <div className="max-w-5xl mx-auto px-6 mb-24">
                <div className="relative overflow-hidden text-center px-8 py-20 border border-amber-400/20 rounded-2xl bg-gradient-to-br from-[#0e1117] via-[#111620] to-[#0e1117]">
                    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-amber-500/[0.05] blur-[80px]" />
                    <h2 className="relative text-4xl md:text-5xl leading-tight tracking-[-0.02em] text-[#e8e6e1] mb-4 font-serif">
                        Stop landing in <em className="italic text-amber-400 font-serif">spam.</em>
                    </h2>
                    <p className="relative text-sm text-white/40 mb-10 font-light">
                        Join thousands of senders who trust EmailWarmup to build their reputation.
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
        </>
    )
}

export default CtaBanner;