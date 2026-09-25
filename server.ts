import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// API health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Gemini AI Proxy endpoint for Copilot Black & OS Assistant
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt, history, systemInstruction } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Use gemini-2.5-flash as default fast model for chat & assistant
    const modelName = "gemini-2.5-flash";

    if (history && Array.isArray(history)) {
      const chat = ai.chats.create({
        model: modelName,
        config: {
          systemInstruction: systemInstruction || "You are Copilot Black, an advanced cyberpunk AI assistant embedded in the Windows Black operating system shell. Be concise, brilliant, helpful, and technical.",
        },
        history: history.map(h => ({
          role: h.role,
          parts: [{ text: h.text }]
        }))
      });
      const result = await chat.sendMessage({ message: prompt });
      return res.json({ response: result.text });
    } else {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are Copilot Black, an advanced cyberpunk AI assistant embedded in the Windows Black operating system shell."
        }
      });
      return res.json({ response: response.text });
    }
  } catch (error: any) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Windows Black Server running on http://localhost:${PORT}`);
  });
}

startServer();
