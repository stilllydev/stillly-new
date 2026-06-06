"use client";

import { useEffect, useRef, useState } from "react";

export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export interface LanyardSpotify {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  timestamps: { start: number; end: number };
}

export interface LanyardActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: { start?: number; end?: number };
  assets?: { large_image?: string; large_text?: string; small_image?: string };
  application_id?: string;
}

export interface LanyardData {
  discord_status: DiscordStatus;
  discord_user: {
    id: string;
    username: string;
    global_name: string | null;
    display_name: string | null;
    avatar: string | null;
  };
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_web: boolean;
}

interface State {
  data: LanyardData | null;
  status: "connecting" | "ready" | "error";
}

const REST = "https://api.lanyard.rest/v1/users/";
const WS = "wss://api.lanyard.rest/socket";

/**
 * Live Discord presence via Lanyard.
 * Prefers the WebSocket (real-time); falls back to REST polling if the socket fails.
 * Requires the user to be a member of the Lanyard Discord server.
 */
export function useLanyard(userId: string | undefined): State {
  const [state, setState] = useState<State>({ data: null, status: "connecting" });
  const heartbeat = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!userId) {
      setState({ data: null, status: "error" });
      return;
    }

    let ws: WebSocket | null = null;
    let poll: ReturnType<typeof setInterval> | null = null;
    let closedByUs = false;

    const startPolling = async () => {
      const fetchOnce = async () => {
        try {
          const res = await fetch(REST + userId, { cache: "no-store" });
          const json = await res.json();
          if (json?.success) setState({ data: json.data, status: "ready" });
          else setState((s) => ({ ...s, status: "error" }));
        } catch {
          setState((s) => ({ ...s, status: "error" }));
        }
      };
      await fetchOnce();
      poll = setInterval(fetchOnce, 20000);
    };

    try {
      ws = new WebSocket(WS);
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.op === 1) {
          // Hello -> begin heartbeat, then subscribe.
          if (heartbeat.current) clearInterval(heartbeat.current);
          heartbeat.current = setInterval(() => {
            ws?.readyState === WebSocket.OPEN && ws.send(JSON.stringify({ op: 3 }));
          }, msg.d.heartbeat_interval);
          ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
        } else if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
          setState({ data: msg.d, status: "ready" });
        }
      };
      ws.onerror = () => {
        if (!closedByUs) startPolling();
      };
      ws.onclose = () => {
        if (heartbeat.current) clearInterval(heartbeat.current);
        if (!closedByUs && !poll) startPolling();
      };
    } catch {
      startPolling();
    }

    return () => {
      closedByUs = true;
      if (heartbeat.current) clearInterval(heartbeat.current);
      if (poll) clearInterval(poll);
      ws?.close();
    };
  }, [userId]);

  return state;
}

export const STATUS_LABEL: Record<DiscordStatus, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
};
