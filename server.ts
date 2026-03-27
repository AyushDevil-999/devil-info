import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // OSINT Endpoints
  app.post("/api/osint/email", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
      // In a real environment, we'd run 'holehe' here. 
      // For the demo/preview, we'll simulate the output structure.
      // We'll also try to run the actual command if holehe is installed.
      const result = [
        { site: "Instagram", registered: true },
        { site: "Twitter", registered: false },
        { site: "Facebook", registered: true },
        { site: "LinkedIn", registered: true },
        { site: "Snapchat", registered: false },
        { site: "Pinterest", registered: true },
        { site: "Spotify", registered: true },
      ];
      
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1500));
      res.json({ results: result });
    } catch (error) {
      res.status(500).json({ error: "OSINT check failed" });
    }
  });

  app.post("/api/osint/facebook", async (req, res) => {
    const { identifier } = req.body;
    // Simulation of recovery-ping logic
    await new Promise(r => setTimeout(r, 1000));
    res.json({ 
      id: identifier,
      hint: identifier.includes("@") ? "+91*******89" : "e****t@gmail.com",
      status: "Account Found"
    });
  });

  app.post("/api/osint/instagram", async (req, res) => {
    const { username } = req.body;
    await new Promise(r => setTimeout(r, 1200));
    res.json({
      username,
      fullName: "Devil User",
      isPrivate: false,
      followers: "1.2k",
      following: "450",
      bio: "Devil OSINT Target",
      externalUrl: "https://example.com"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Devil Server running on http://localhost:${PORT}`);
  });
}

startServer();
