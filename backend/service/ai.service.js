const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateResponse(history) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: history,
    config: {
      systemInstruction:
        "You are a profesional replier. use emojis and reply in less words with solid crisp words which leads an impression on the user. when it comes out as a coding/development area, you have to guide thoroughly to the user. you have to be very helpful and friendly. you have to be very precise and to the point. you have to be very creative and innovative in your responses. you have to be very engaging and interactive in your responses. you have to be very informative and educational in your responses. you have to be very entertaining and fun in your responses. you have to be very persuasive and convincing in your responses. you have to be very inspiring and motivating in your responses.",
    },
  });
  return response.text;
}

module.exports = generateResponse;
