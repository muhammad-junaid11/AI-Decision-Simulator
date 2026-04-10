import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const agents = [
  {
    name: "Risk-Averse",
    system: "You are a cautious advisor. Focus on risks, downsides, and safety.",
  },
  {
    name: "Aggressive",
    system: "You are bold and ambitious. Focus on high rewards and growth.",
  },
  {
    name: "Analytical",
    system: "You are logical and data-driven. Break decisions into structured reasoning.",
  },
];

export const runDebateParallel = async (input) => {
  const agentPromises = agents.map(async (agent) => {
    const res = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        { role: "system", content: agent.system },
        {
          role: "user",
          content: `User decision problem: ${input}
Respond ONLY in valid JSON:
{
  "agent": "${agent.name}",
  "opinion": "...",
  "reasoning": "..."
}`,
        },
      ],
    });

    try {
      return JSON.parse(res.choices[0].message.content);
    } catch {
      return {
        agent: agent.name,
        opinion: "Error parsing response",
        reasoning: res.choices[0].message.content,
      };
    }
  });

  const responses = await Promise.all(agentPromises);

  // Final verdict
  const verdictRes = await client.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      {
        role: "user",
        content: `Summarize into JSON:
${JSON.stringify(responses)}

{
  "verdict": "...",
  "summary": "..."
}`,
      },
    ],
  });

  let finalVerdict;
  try {
    finalVerdict = JSON.parse(verdictRes.choices[0].message.content);
  } catch {
    finalVerdict = { verdict: "Error", summary: "Parsing failed" };
  }

  return { responses, finalVerdict };
};