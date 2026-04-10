import { client } from "../config/openai.js";

const agents = [
  { name: "Risk-Averse", system: "You are cautious." },
  { name: "Aggressive", system: "You are bold." },
  { name: "Analytical", system: "You are logical." },
];

export const debateController = async (req, res) => {
  const problem =
    req.method === "GET" ? req.query.problem : req.body.problem;

  if (!problem) {
    return res.status(400).json({ message: "Problem is required" });
  }

  const isStream = req.method === "GET";

  if (isStream) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders(); // ✅ important for streaming
  }

  let responses = [];

  try {
    // 🔥 PARALLEL EXECUTION
    await Promise.all(
      agents.map(async (agent, index) => {
        const response = await client.chat.completions.create({
          model: "gpt-5-nano",
          messages: [
            { role: "system", content: agent.system },
            {
              role: "user",
              content: `Problem: ${problem}
Return ONLY JSON:
{
 "agent": "${agent.name}",
 "opinion": "...",
 "reasoning": "..."
}`,
            },
          ],
        });

        let parsed;
        try {
          parsed = JSON.parse(response.choices[0].message.content);
        } catch {
          parsed = {
            agent: agent.name,
            opinion: "Parse Error",
            reasoning: response.choices[0].message.content,
          };
        }

        // ✅ keep order correct
        responses[index] = parsed;

        if (isStream) {
          res.write(
            `data: ${JSON.stringify({ type: "agent", data: parsed })}\n\n`
          );
        }
      })
    );

    // 🔥 FINAL VERDICT
    const verdictRes = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "user",
          content: `Summarize:
${JSON.stringify(responses)}

{
 "verdict": "...",
 "summary": "..."
}`,
        },
      ],
    });

    let verdict;
    try {
      verdict = JSON.parse(verdictRes.choices[0].message.content);
    } catch {
      verdict = { verdict: "Error", summary: "Parsing failed" };
    }

    if (isStream) {
      res.write(
        `data: ${JSON.stringify({ type: "verdict", data: verdict })}\n\n`
      );
      return res.end();
    }

    return res.json({
      type: "debate",
      responses,
      finalVerdict: verdict,
    });
  } catch (err) {
    console.error("❌ Debate error:", err);

    if (isStream) {
      res.write(`data: ${JSON.stringify({ type: "error" })}\n\n`);
      return res.end();
    }

    return res.status(500).json({ message: "Debate failed" });
  }
};