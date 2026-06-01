import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { RAMP } from "@/utils/constant";

const WarmupChart = () => {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Card className="bg-[#0e1117] border-white/[0.07] overflow-hidden mt-12">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.07] bg-white/[0.02]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[10px] tracking-widest uppercase text-white/30 font-mono">
            warmup_ramp — emails per day
          </span>
        </div>
        <CardContent className="p-6 md:p-8 space-y-3.5">
          {RAMP.map((r, i) => (
            <div key={r.day} className="flex items-center gap-4">
              <span className="w-12 text-right text-[10px] text-white/30 font-mono flex-shrink-0">{r.day}</span>
              <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-700"
                  style={{ width: animated ? `${r.pct}%` : "0%", transitionDelay: `${i * 100}ms` }}
                />
              </div>
              <span className="w-6 text-[10px] text-amber-400 font-mono flex-shrink-0">{r.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default WarmupChart;