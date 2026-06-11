const Label = ({ children }: { children: string }) => {
    return (
        <p className="text-[10px] tracking-[0.18em] uppercase text-amber-400 mb-4 font-mono">{children}</p>
    );
}


export default Label;