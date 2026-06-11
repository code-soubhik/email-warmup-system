"use client";

import { useState } from "react";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Separator } from "@/_components/ui/separator";
import { Switch } from "@/_components/ui/switch";
import { Input } from "@/_components/ui/input";
// import { saveWarmupConfig } from "@/actions/warmup";

// ── Types ──────────────────────────────────────────────────────
interface EmailConfig {
  id: number;
  email: string;
}

interface Props {
  userEmails: EmailConfig[];         // emails belonging to the logged-in user
  poolEmails: EmailConfig[];         // all available recipient pool emails
  existingConfig?: {
    id: number;
    warmupEmailId: number;
    totalNoOfEmail: number;
    minDelaySec: number;
    maxDelaySec: number;
    replyProbability: number;
    startTime: string;
    recipientIds: number[];
  };
}

// ─────────────────────────────────────────────────────────────
export default function WarmupConfigPage({ userEmails, poolEmails, existingConfig }: Props) {
  const [editing, setEditing] = useState(!existingConfig);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  // ── form state ──────────────────────────────────────────────
  const [warmupEmailId,    setWarmupEmailId]    = useState<number | null>(existingConfig?.warmupEmailId ?? null);
  const [totalNoOfEmail,   setTotalNoOfEmail]   = useState(existingConfig?.totalNoOfEmail  ?? 50);
  const [minDelaySec,      setMinDelaySec]      = useState(existingConfig?.minDelaySec     ?? 10000);
  const [maxDelaySec,      setMaxDelaySec]      = useState(existingConfig?.maxDelaySec     ?? 90000);
  const [replyProbability, setReplyProbability] = useState(existingConfig?.replyProbability ?? 0.45);
  const [startTime,        setStartTime]        = useState(existingConfig?.startTime ?? new Date().toISOString()?.slice(0, 16));
  const [recipientIds,     setRecipientIds]     = useState<number[]>(existingConfig?.recipientIds ?? []);

  // ── recipient search ─────────────────────────────────────────
  const [recipientQuery,   setRecipientQuery]   = useState("");
  const [recipientOpen,    setRecipientOpen]    = useState(false);
  const [showAllRecipients, setShowAllRecipients] = useState(false);

  const filteredPool = poolEmails?.filter(
    (e) =>
      !recipientIds.includes(e.id) &&
      e.email.toLowerCase().includes(recipientQuery.toLowerCase())
  );

  function addRecipient(id: number) {
    setRecipientIds((prev) => [...prev, id]);
    setRecipientQuery("");
  }

  function removeRecipient(id: number) {
    setRecipientIds((prev) => prev?.filter((r) => r !== id));
  }

  function handleToggleEdit(val: boolean) {
    if (!val && existingConfig) {
      // cancel  reset to existing
      setWarmupEmailId(existingConfig.warmupEmailId);
      setTotalNoOfEmail(existingConfig.totalNoOfEmail);
      setMinDelaySec(existingConfig.minDelaySec);
      setMaxDelaySec(existingConfig.maxDelaySec);
      setReplyProbability(existingConfig.replyProbability);
      setStartTime(existingConfig.startTime);
      setRecipientIds(existingConfig.recipientIds);
    }
    setEditing(val);
    setError("");
  }

  async function handleSave() {
    setError("");

    if (!warmupEmailId)              return setError("Select a warmup email.");
    if (recipientIds?.length === 0)   return setError("Add at least one recipient.");
    if (minDelaySec >= maxDelaySec)  return setError("Min delay must be less than max delay.");

    setSaving(true);
    // const result = await saveWarmupConfig({
    //   configId: existingConfig?.id,
    //   warmupEmailId,
    //   totalNoOfEmail,
    //   minDelaySec,
    //   maxDelaySec,
    //   replyProbability,
    //   startTime,
    //   recipientIds,
    // });
    setSaving(false);

    // if (result?.error) { setError(result.error); return; }
    setEditing(false);
  }

  const selectedWarmupEmail = userEmails?.find((e) => e.id === warmupEmailId);
  const selectedRecipients  = poolEmails?.filter((e) => recipientIds.includes(e.id));
  const visibleRecipients   = showAllRecipients ? selectedRecipients : selectedRecipients?.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e8e6e1] px-4 py-10">
      <div className="max-w-xl mx-auto space-y-8">

        {/* ── Header row ───────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-amber-400 mb-1">
              Warmup
            </p>
            <h1 className="text-2xl font-serif text-[#e8e6e1] tracking-tight">
              Configuration
            </h1>
          </div>

          {/* Edit toggle */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/30">
              {editing ? "Editing" : "View"}
            </span>
            <Switch
              checked={editing}
              onCheckedChange={handleToggleEdit}
              className="data-[state=checked]:bg-amber-400"
            />
          </div>
        </div>

        <Separator className="bg-white/[0.07]" />

        {/* ══════════════════════════════════════════════════
            SECTION 1  Warmup email
        ══════════════════════════════════════════════════ */}
        <div className="space-y-3">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30">
            Warmup email
          </p>

          {editing ? (
            <div className="grid grid-cols-1 gap-2">
              {userEmails?.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setWarmupEmailId(e.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                    warmupEmailId === e.id
                      ? "border-amber-400/50 bg-amber-400/10"
                      : "border-white/[0.07] bg-[#0e1117] hover:border-white/20"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono flex-shrink-0 ${
                    warmupEmailId === e.id
                      ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                      : "bg-white/[0.06] text-white/40 border border-white/10"
                  }`}>
                    {e.email[0].toUpperCase()}
                  </span>
                  <span className="text-sm font-mono text-[#e8e6e1]">{e.email}</span>
                  {warmupEmailId === e.id && (
                    <span className="ml-auto text-amber-400 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.07] bg-[#0e1117]">
              <span className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-[11px] font-mono text-amber-400 flex-shrink-0">
                {selectedWarmupEmail?.email[0].toUpperCase() ?? "?"}
              </span>
              <span className="text-sm font-mono text-[#e8e6e1]">
                {selectedWarmupEmail?.email ?? ""}
              </span>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════
            SECTION 2  Configuration fields
        ══════════════════════════════════════════════════ */}
        <div className="space-y-3">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30">
            Settings
          </p>

          <div className="rounded-xl border border-white/[0.07] bg-[#0e1117] divide-y divide-white/[0.06]">

            {/* Total emails */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/30">Total emails</span>
              {editing ? (
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={totalNoOfEmail}
                  onChange={(e) => setTotalNoOfEmail(Number(e.target.value))}
                  className="h-8 w-24 bg-white/[0.04] border-white/10 text-[#e8e6e1] text-right font-mono text-sm focus-visible:border-amber-400 focus-visible:ring-0"
                />
              ) : (
                <span className="text-sm font-mono text-[#e8e6e1]">{totalNoOfEmail}</span>
              )}
            </div>

            {/* Min delay */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/30">Min delay</span>
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={60}
                    value={minDelaySec}
                    onChange={(e) => setMinDelaySec(Number(e.target.value))}
                    className="h-8 w-28 bg-white/[0.04] border-white/10 text-[#e8e6e1] text-right font-mono text-sm focus-visible:border-amber-400 focus-visible:ring-0"
                  />
                  <span className="text-[10px] text-white/30 font-mono">s</span>
                </div>
              ) : (
                <span className="text-sm font-mono text-[#e8e6e1]">
                  {minDelaySec}s
                  <span className="text-white/30 ml-1.5">≈ {(minDelaySec / 3600).toFixed(1)}h</span>
                </span>
              )}
            </div>

            {/* Max delay */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/30">Max delay</span>
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={60}
                    value={maxDelaySec}
                    onChange={(e) => setMaxDelaySec(Number(e.target.value))}
                    className="h-8 w-28 bg-white/[0.04] border-white/10 text-[#e8e6e1] text-right font-mono text-sm focus-visible:border-amber-400 focus-visible:ring-0"
                  />
                  <span className="text-[10px] text-white/30 font-mono">s</span>
                </div>
              ) : (
                <span className="text-sm font-mono text-[#e8e6e1]">
                  {maxDelaySec}s
                  <span className="text-white/30 ml-1.5">≈ {(maxDelaySec / 3600).toFixed(1)}h</span>
                </span>
              )}
            </div>

            {/* Reply probability */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/30">Reply probability</span>
              {editing ? (
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0.3}
                    max={0.6}
                    step={0.01}
                    value={replyProbability}
                    onChange={(e) => setReplyProbability(parseFloat(e.target.value))}
                    className="w-24 accent-amber-400"
                  />
                  <span className="text-sm text-amber-400 font-mono w-9 text-right">
                    {Math.round(replyProbability * 100)}%
                  </span>
                </div>
              ) : (
                <span className="text-sm font-mono text-[#e8e6e1]">
                  {Math.round(replyProbability * 100)}%
                </span>
              )}
            </div>

            {/* Start time */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/30">Start time</span>
              {editing ? (
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-8 bg-white/[0.04] border-white/10 text-[#e8e6e1] font-mono text-sm focus-visible:border-amber-400 focus-visible:ring-0 [color-scheme:dark]"
                />
              ) : (
                <span className="text-sm font-mono text-[#e8e6e1]">
                  {new Date(startTime).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            SECTION 3  Recipients
        ══════════════════════════════════════════════════ */}
        <div className="space-y-3">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30">
            Recipient emails
          </p>

          {/* search + add */}
          {editing && (
            <div className="relative">
              <Input
                placeholder="Search emails to add..."
                value={recipientQuery}
                onChange={(e) => { setRecipientQuery(e.target.value); setRecipientOpen(true); }}
                onFocus={() => setRecipientOpen(true)}
                onBlur={() => setTimeout(() => setRecipientOpen(false), 150)}
                className="h-10 bg-white/[0.04] border-white/10 text-[#e8e6e1] placeholder:text-white/20 focus-visible:border-amber-400 focus-visible:ring-0 font-mono text-sm"
              />
              {recipientOpen && filteredPool && filteredPool?.length > 0 && (
                <div className="absolute z-30 mt-1 w-full max-h-44 overflow-y-auto rounded-lg border border-white/10 bg-[#0d1018] shadow-2xl">
                  {filteredPool?.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onMouseDown={() => addRecipient(e.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-colors text-left"
                    >
                      <span className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[10px] font-mono text-white/50 flex-shrink-0">
                        {e.email[0].toUpperCase()}
                      </span>
                      <span className="text-sm font-mono text-white/70">{e.email}</span>
                      <span className="ml-auto text-[10px] font-mono text-amber-400/60">+ add</span>
                    </button>
                  ))}
                </div>
              )}
              {recipientOpen && filteredPool?.length === 0 && recipientQuery && (
                <div className="absolute z-30 mt-1 w-full rounded-lg border border-white/10 bg-[#0d1018] px-4 py-3">
                  <p className="text-xs text-white/30 font-mono">No matching emails.</p>
                </div>
              )}
            </div>
          )}

          {/* selected recipients list */}
          {selectedRecipients?.length > 0 ? (
            <div className="rounded-xl border border-white/[0.07] bg-[#0e1117] overflow-hidden">
              {/* list header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                <span className="text-[10px] font-mono tracking-widest uppercase text-white/30">
                  {selectedRecipients?.length} selected
                </span>
                {selectedRecipients?.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllRecipients((v) => !v)}
                    className="text-[10px] font-mono text-amber-400/70 hover:text-amber-400 transition-colors tracking-widest uppercase"
                  >
                    {showAllRecipients ? "Show less" : `Show all ${selectedRecipients?.length}`}
                  </button>
                )}
              </div>

              {/* list rows */}
              <div className="divide-y divide-white/[0.04]">
                {visibleRecipients?.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-[10px] font-mono text-amber-400 flex-shrink-0">
                      {e.email[0].toUpperCase()}
                    </span>
                    <span className="text-sm font-mono text-white/70 flex-1 truncate">{e.email}</span>
                    {editing && (
                      <button
                        type="button"
                        onClick={() => removeRecipient(e.id)}
                        className="text-white/20 hover:text-red-400 transition-colors text-sm ml-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* collapsed hint */}
              {!showAllRecipients && selectedRecipients?.length > 4 && (
                <div className="px-5 py-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5">
                    {selectedRecipients?.slice(4)?.map((e) => (
                      <Badge
                        key={e.id}
                        variant="outline"
                        className="border-white/10 bg-white/[0.04] text-white/30 font-mono text-[9px] px-1.5 py-0.5"
                      >
                        {e.email.split("@")[0]}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-16 rounded-xl border border-dashed border-white/10 bg-[#0e1117]">
              <p className="text-xs font-mono text-white/20">No recipients added yet</p>
            </div>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <p className="text-sm text-destructive font-mono text-center">{error}</p>
        )}

        {/* ── Save button ─────────────────────────────────── */}
        {editing && (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-11 bg-amber-400 text-[#080a0f] hover:bg-amber-300 font-mono text-[11px] tracking-widest uppercase rounded-md"
          >
            {saving ? "Saving..." : "Save configuration"}
          </Button>
        )}

      </div>
    </div>
  );
}