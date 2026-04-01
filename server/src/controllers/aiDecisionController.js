import OpenAI from "openai";

export const getNextStep = async (req, res) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log("OpenAI Key inside controller?", process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌");

  const { history } = req.body;

  try {
    const prompt = `
You are a **personalized career advisor** for any field, not just MERN.
Conversation so far:
${JSON.stringify(history)}

Rules:
- Ask ONE question at a time
- Give 3-4 options per question
- Always include an option: "Other / None of these"
- Avoid repeating previous questions
- If enough info is collected, give a career recommendation

Respond ONLY in JSON:
IF QUESTION:
{
  "type": "question",
  "question": "...",
  "options": ["Option 1", "Option 2", "Option 3", "Other / None of these"]
}

IF RESULT:
{
  "type": "result",
  "title": "...",
  "description": "...",
  "suggestions": ["...", "..."]
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: [{ role: "user", content: prompt }],
    });

    let parsed;
    try {
      parsed = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      console.error("Failed to parse AI response:", response.choices[0].message.content);
      return res.status(500).json({ message: "Invalid AI response" });
    }

    res.json(parsed);
  } catch (err) {
    console.error("OpenAI error:", err);
    if (err.code === "insufficient_quota" || err.status === 429) {
      return res.status(429).json({ message: "OpenAI quota exceeded" });
    }
    res.status(500).json({ message: "AI error" });
  }
};