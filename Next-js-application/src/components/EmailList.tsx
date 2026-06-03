"use client";

import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { EmailConfig } from "@prisma/client";

const EmailList = ({ emailList }: { emailList: EmailConfig[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const status = searchParams.get('status');

    if (status === 'oauth_cancelled') {
      toast.error('OAuth authorization was cancelled.');
      router.replace(pathname);
    } else if (status === "connected") {
      toast.success('Email successfully connected');
      router.replace(pathname);
    }
  }, [searchParams, router, pathname]);

  return (
    <div className="bg-[#080a0f] text-[#e8e6e1] min-h-screen px-6 py-24">
      <div className="max-w-3xl mx-auto space-y-8">

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif">Connected Emails</h1>
          <Button
            onClick={() => { window.location.href = "/api/google/connect"; }}
            className="bg-amber-400 text-[#080a0f] hover:bg-amber-300 font-mono text-[11px] uppercase tracking-widest"
          >
            Add Email
          </Button>
        </div>

        <div className="space-y-4">
          {emailList.map((item, i) => (
            <Card key={i} className="border-white/[0.07] bg-[#0e1117]">
              <CardContent className="flex items-center justify-between px-5">
                <div>
                  <p className='text-gray-200'>{item.email}</p>
                  <p className={`text-xs font-mono uppercase ${
                    item.status === "ACTIVE"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}>
                    {item.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button className="h-8 px-3 text-[10px] font-mono uppercase border border-white/[0.07] text-white/40 hover:text-white/70">
                    Use
                  </Button>
                  <Button className="h-8 px-3 text-[10px] font-mono uppercase bg-red-500/80 hover:bg-red-500 text-white">
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
};

export default EmailList;