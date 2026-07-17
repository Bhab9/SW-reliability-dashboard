import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Initialization
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/analyze", async (req, res) => {
    const { codeSnippet, description, type } = req.body;

    if (!codeSnippet) {
      return res.status(400).json({ error: "Code snippet is required" });
    }

    try {
      const prompt = `
        Analyze the following software defect found during a reliability test.
        
        Defect Type: ${type}
        Description: ${description}
        Code Snippet:
        \`\`\`c
        ${codeSnippet}
        \`\`\`
        
        Please provide:
        1. A clear explanation of why this is a defect (Root Cause).
        2. A recommended code correction.
        3. Best practice advice to prevent this in the future.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: {
                type: Type.STRING,
                description: "The root cause analysis and explanation.",
              },
              suggestion: {
                type: Type.STRING,
                description: "The corrected code snippet and best practices.",
              },
            },
            required: ["analysis", "suggestion"],
          },
        },
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to analyze defect. Please check your API key." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
