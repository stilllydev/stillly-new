"use client";

import { useLanyard, STATUS_LABEL, type DiscordStatus } from "@/lib/lanyard";
import { site } from "@/lib/site";
import SpotifyCard from "./SpotifyCard";

const STATUS_COLOR: Record<DiscordStatus, string> = {
  online: "#43b581",
  idle: "#faa61a",
  dnd: "#f04747",
  offline: "#747f8d",
};

// Activity type 4 is a custom status; skip it in the activity list.
const ACTIVITY_VERB: Record<number, string> = {
  0: "Playing",
  1: "Streaming",
  2: "Listening to",
  3: "Watching",
  5: "Competing in",
};

export default function BioCard() {
  const { data, status } = useLanyard(site.discordUserId);

  const user = data?.discord_user;
  const presence: DiscordStatus = data?.discord_status ?? "offline";
  const avatarUrl =
    user?.avatar && user.id
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
          user.avatar.startsWith("a_") ? "gif" : "png"
        }?size=128`
      : null;

  const activities = (data?.activities ?? []).filter((a) => a.type !== 4 && a.name !== "Spotify");
  const customStatus = data?.activities?.find((a) => a.type === 4);

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl glass p-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-white text-2xl font-bold text-black font-[family-name:var(--font-display)]">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover grayscale" />
            ) : (
              site.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <span
            className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-black"
            style={{ background: STATUS_COLOR[presence] }}
            title={STATUS_LABEL[presence]}
          />
        </div>
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-display)] text-xl font-bold leading-tight">
            {user?.global_name || user?.display_name || site.name}
          </p>
          <p className="font-[family-name:var(--font-mono)] text-xs text-[color:var(--color-fg-dim)]">
            @{user?.username ?? site.name} · {STATUS_LABEL[presence]}
          </p>
          {customStatus?.state && (
            <p className="mt-1 truncate text-xs text-[color:var(--color-fg-faint)]">
              {customStatus.state}
            </p>
          )}
        </div>
      </div>

      {/* Spotify */}
      {data?.listening_to_spotify && data.spotify && (
        <div className="mt-4">
          <SpotifyCard spotify={data.spotify} />
        </div>
      )}

      {/* Other activities */}
      {activities.length > 0 && (
        <ul className="mt-4 space-y-2">
          {activities.slice(0, 2).map((a) => (
            <li
              key={a.id}
              className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-3 text-sm"
            >
              <p className="font-[family-name:var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[color:var(--color-fg-faint)]">
                {ACTIVITY_VERB[a.type] ?? "In"}
              </p>
              <p className="font-medium text-white">{a.name}</p>
              {a.details && <p className="text-xs text-[color:var(--color-fg-dim)]">{a.details}</p>}
              {a.state && <p className="text-xs text-[color:var(--color-fg-faint)]">{a.state}</p>}
            </li>
          ))}
        </ul>
      )}

      {/* States */}
      {status !== "ready" && (
        <p className="mt-4 font-[family-name:var(--font-mono)] text-xs text-[color:var(--color-fg-faint)]">
          {status === "connecting"
            ? "connecting to discord…"
            : site.discordUserId
            ? "presence unavailable — is the account in the Lanyard server?"
            : "set NEXT_PUBLIC_LANYARD_USER_ID to show live presence"}
        </p>
      )}
    </div>
  );
}
