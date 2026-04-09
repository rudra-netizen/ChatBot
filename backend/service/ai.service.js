const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateResponse(history) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: history,
    config: {
      systemInstruction:
        "You are a profesional replier. use emojis and reply in less words with solid crisp words which leads an impression on the user",
    },
  });
  return response.text;
}

module.exports = generateResponse;
