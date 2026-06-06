import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import Humanizer from "@/components/tools/Humanizer";

export const metadata: Metadata = {
  title: "Humanizer",
  robots: { index: false, follow: false },
};

export default function HumanizerPage() {
  return (
    <ToolShell
      eyebrow="Tool"
      title="Humanizer"
      intro="Strip the AI tells out of any text. Based on the open-source blader/humanizer ruleset — 30 patterns across content, language, style, communication and hedging — run through Groq."
    >
      <Humanizer />
    </ToolShell>
  );
}
