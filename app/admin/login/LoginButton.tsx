"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const signIn = async () => {
    setLoading(true);
    setErr(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setErr(error.message);
        setLoading(false);
      }
    } catch {
      setErr("Supabase isn't configured yet. Add your env vars.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={signIn}
        disabled={loading}
        className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-3 font-[family-name:var(--font-display)] font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-60"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.3.5a18.3 18.3 0 0 1 4.4 1.4 16 16 0 0 0-15-.2A18 18 0 0 1 8.9 3.5L8.6 3A19.8 19.8 0 0 0 3.7 4.4 19.9 19.9 0 0 0 .3 18a19.9 19.9 0 0 0 6 3l.7-1a13 13 0 0 1-2-1l.5-.4a14 14 0 0 0 12 0l.5.4a13 13 0 0 1-2 1l.7 1a19.9 19.9 0 0 0 6-3 19.9 19.9 0 0 0-3.5-13.6ZM8.3 14.6c-1.1 0-2-1-2-2.3s.9-2.3 2-2.3 2 1 2 2.3-.9 2.3-2 2.3Zm7.4 0c-1.1 0-2-1-2-2.3s.9-2.3 2-2.3 2 1 2 2.3-.9 2.3-2 2.3Z" />
        </svg>
        {loading ? "Redirecting…" : "Sign in with Discord"}
      </button>
      {err && <p className="font-[family-name:var(--font-mono)] text-xs text-red-400">{err}</p>}
    </div>
  );
}
