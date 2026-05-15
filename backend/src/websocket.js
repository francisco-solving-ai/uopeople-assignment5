import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

// ----------------------------------------------------
// Gemini API
// ----------------------------------------------------

async function sendDataToGemini(audioBuffer) {
  // Simulate Gemini processing latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulated Gemini response
  const transcript = `Transcribed ${audioBuffer.length} bytes of audio`;

  const aiText = "Hello from Gemini";

  const audioBase64 = Buffer.from("AI_AUDIO_RESPONSE").toString("base64");

  return {
    transcript,
    aiText,
    audio: {
      mimeType: "audio/pcm",
      sampleRate: 24000,
      data: audioBase64,
    },
  };
}

// ----------------------------------------------------
// WebSocket Server
// ----------------------------------------------------

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Initial connection message
  ws.send(
    JSON.stringify({
      type: "system",
      message: "Connected to Gemini websocket server",
    }),
  );

  // ------------------------------------------------
  // Incoming Messages
  // ------------------------------------------------

  ws.on("message", async (message, isBinary) => {
    try {
      // --------------------------------------------
      // AUDIO MESSAGE
      // --------------------------------------------

      if (isBinary) {
        console.log("Received binary audio chunk");


        // Send audio to Gemini
        const geminiResponse = await sendDataToGemini(
          message.audioBuffer,
          message.snapshotBase64,
          message.currentUrl,
          message.traversedDom,
        );

        // ----------------------------------------
        // Send AI text response
        // ----------------------------------------

        ws.send(
          JSON.stringify({
            type: "ai_text",
            text: geminiResponse.aiText,
          }),
        );

        // ----------------------------------------
        // Send AI audio response
        // ----------------------------------------

        ws.send(
          JSON.stringify({
            type: "audio",
            mimeType: geminiResponse.audio.mimeType,
            sampleRate: geminiResponse.audio.sampleRate,
            data: geminiResponse.audio.data,
          }),
        );

        // ----------------------------------------
        // Send node to highlight if any
        // ----------------------------------------

        if (geminiResponse.highlightNode) {
          ws.send(
            JSON.stringify({
              type: "highlight-node",
              text: geminiResponse.highlightNode,
            }),
          );
        }

        if (geminiResponse) return;
      }

      // --------------------------------------------
      // JSON TEXT MESSAGE
      // --------------------------------------------

      const data = JSON.parse(message.toString());

      console.log("Received JSON message:", data);

      switch (data.type) {
        case "ping":
          ws.send(
            JSON.stringify({
              type: "pong",
              timestamp: Date.now(),
            }),
          );
          break;

        case "text":
          ws.send(
            JSON.stringify({
              type: "echo",
              text: data.text,
            }),
          );
          break;

        default:
          ws.send(
            JSON.stringify({
              type: "warning",
              message: `Unknown message type: ${data.type}`,
            }),
          );
      }
    } catch (error) {
      console.error("WebSocket error:", error);

      ws.send(
        JSON.stringify({
          type: "error",
          message: error.message,
        }),
      );
    }
  });

  // ------------------------------------------------
  // Disconnect
  // ------------------------------------------------

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// ----------------------------------------------------
// Start Server
// ----------------------------------------------------

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
