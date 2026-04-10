import jsPDF from "jspdf";

type AiResult = {
  title: string;
  description: string;
  suggestions: string[];
};

type DebateHistoryItem = {
  agent: string;
  opinion: string;
  reasoning: string;
};

type DebateResult = {
  type: "debate";
  history: DebateHistoryItem[];
  finalVerdict?: {
    verdict: string;
    summary: string;
  } | null;
};

type AnyResult = AiResult | DebateResult;

const cleanFileName = (text: string) =>
  text
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "ai-result";

export const downloadResultPDF = (result: AnyResult) => {
  const pdf = new jsPDF();
  let y = 10;

  const isDebate = (result as DebateResult).type === "debate";

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);

  pdf.text(
    isDebate ? "AI Debate Result Report" : "AI Decision Result Report",
    10,
    y
  );

  y += 10;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

 
  if (!isDebate) {
    const r = result as AiResult;

    pdf.text(`Title: ${r.title}`, 10, (y += 10));

    const descLines = pdf.splitTextToSize(r.description || "", 180);
    pdf.text(descLines, 10, (y += 8));
    y += descLines.length * 6;

    pdf.setFont("bold");
    pdf.text("Suggestions:", 10, (y += 10));
    pdf.setFont("normal");

    r.suggestions?.forEach((s, i) => {
      const lines = pdf.splitTextToSize(`${i + 1}. ${s}`, 180);
      pdf.text(lines, 10, (y += 8));
      y += lines.length * 6;
    });
  }


  else {
    const d = result as DebateResult;

    pdf.setFont("bold");
    pdf.text("Agent Opinions:", 10, (y += 10));
    pdf.setFont("normal");

    d.history?.forEach((h) => {
      const block = `
Agent: ${h.agent}
Opinion: ${h.opinion}
Reasoning: ${h.reasoning}
-------------------
      `;

      const lines = pdf.splitTextToSize(block, 180);
      pdf.text(lines, 10, (y += 10));
      y += lines.length * 5;
    });

    if (d.finalVerdict) {
      pdf.setFont("bold");
      pdf.text("Final Verdict:", 10, (y += 10));
      pdf.setFont("normal");

      const v1 = pdf.splitTextToSize(d.finalVerdict.verdict, 180);
      pdf.text(v1, 10, (y += 8));
      y += v1.length * 6;

      const v2 = pdf.splitTextToSize(d.finalVerdict.summary, 180);
      pdf.text(v2, 10, (y += 6));
    }
  }


  //  DYNAMIC FILE NAME


  let fileName = "ai-result";

  if (isDebate) {
    const d = result as DebateResult;

    fileName =
      cleanFileName(
        d.history?.[0]?.opinion ||
        d.history?.[0]?.agent ||
        "ai-debate-result"
      );
  } else {
    const r = result as AiResult;

    fileName = cleanFileName(r.title || "ai-decision-result");
  }

  pdf.save(`${fileName}.pdf`);
};