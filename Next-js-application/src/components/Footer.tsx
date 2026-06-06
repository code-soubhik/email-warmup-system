import React from 'react'

const Footer = () => {
    return (
        <>
            <footer className="border-t border-white/[0.07] px-6 md:px-12 py-8 flex items-center justify-between flex-wrap gap-4">
                <a href="/" className="text-base text-white/40 no-underline font-serif">
                    EmailWarmup
                </a>
                <span className="text-[10px] tracking-widest text-white/20 font-mono">© 2025 EmailWarmup. All rights reserved.</span>
            </footer>
        </>
    )
}

export default Footer