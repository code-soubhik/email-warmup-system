import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";
import { useSessionAuth } from "@/providers/SessionProvider";

const Header = () => {
    const { session, setSession } = useSessionAuth();
    const isAuth = session.isAuth;

    const handleLogout = async () => {
        setSession({...session, userId: null, isAuth: false});
        await logoutAction();
    }
    
    return (
        <>
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
                                onClick={handleLogout}
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
        </>
    )
}

export default Header