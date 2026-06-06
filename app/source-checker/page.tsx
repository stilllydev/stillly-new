import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import SourceChecker from "@/components/tools/SourceChecker";

export const metadata: Metadata = {
  title: "Source Checker",
  robots: { index: false, follow: false },
};

export default function SourceCheckerPage() {
  return (
    <ToolShell
      eyebrow="Tool"
      title="Source Checker"
      intro="Paste an article URL or drop a screenshot. Get a reliability score, a primary/secondary/tertiary classification, author and citation checks, bias read, and concrete next steps — powered by Groq."
    >
      <SourceChecker />
    </ToolShell>
  );
}
