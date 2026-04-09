require("dotenv").config();
const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./service/ai.service");

const httpServer = createServer(app);
const chatHistory = [];
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  // ...

  console.log("connected");

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  /*socket.on("message", (data) => {
    console.log("This is the data we get ", data);
  });*/

  socket.on("message", async (data) => {
    console.log("Ai recived the message : ", data);
    chatHistory.push({
      role: "user",
      parts: [{ text: data }],
    });
    const response = await generateResponse(chatHistory);
    console.log("AI RESPONSE", response);
    chatHistory.push({
      role: "model",
      parts: [{ text: response }],
    });
    socket.emit("ai-response-message", { response });
  });
});

httpServer.listen(3000, () => {
  console.log("The server is running on port 3000");
});
