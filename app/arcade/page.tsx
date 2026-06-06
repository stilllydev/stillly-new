import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import GamePlayer from "@/components/arcade/GamePlayer";
import { games } from "@/lib/games";

export const metadata: Metadata = {
  title: "Arcade",
  robots: { index: false, follow: false },
};

export default function ArcadePage() {
  return (
    <ToolShell
      eyebrow="Hidden"
      title="Arcade"
      intro="A few open-source browser games — playable here, fullscreen and all. Only freely-licensed titles; drop each game's static build into /public/games/<slug> to switch it on."
    >
      <GamePlayer games={games} />
    </ToolShell>
  );
}
