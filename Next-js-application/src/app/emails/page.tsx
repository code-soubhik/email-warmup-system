"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';


const emails = [
  { email: "test1@gmail.com", status: "active" },
  { email: "test2@gmail.com", status: "expired" },
];

export default function EmailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const status = searchParams.get('status');

    if (status === 'oauth_cancelled') {
      toast.error('OAuth authorization was cancelled.');

      // Remove query params from URL
      router.replace(pathname);
    }
    else if(status === "connected") {
      toast.success('Email successfully connected');

      // Remove query params from URL
      router.replace(pathname);
    }
  }, [searchParams, router, pathname]);
  
  return (
    <div className="bg-[#080a0f] text-[#e8e6e1] min-h-screen px-6 py-24">

      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif">Connected Emails</h1>
          <Button onClick={() => { window.location.href = "/api/google/connect"; }} className="bg-amber-400 text-[#080a0f] hover:bg-amber-300 font-mono text-[11px] uppercase tracking-widest">
            Add Email
          </Button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {emails.map((item, i) => (
            <Card key={i} className="border-white/[0.07] bg-[#0e1117]">
              <CardContent className="flex items-center justify-between p-5">

                <div>
                  <p className="text-[#e8e6e1]">{item.email}</p>
                  <p className={`text-xs font-mono tracking-widest uppercase ${item.status === "active" ? "text-green-400" : "text-red-400"
                    }`}>
                    {item.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button className="h-8 px-3 text-[10px] font-mono uppercase tracking-widest bg-transparent border border-white/[0.07] text-white/40 hover:text-white/70">
                    Use
                  </Button>
                  <Button className="h-8 px-3 text-[10px] font-mono uppercase tracking-widest bg-red-500/80 hover:bg-red-500 text-white">
                    Remove
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}