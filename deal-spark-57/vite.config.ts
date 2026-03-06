import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    agentRunnerPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

/**
 * Vite plugin that adds a POST /api/run-agent endpoint.
 * Spawns the Python agent as a child process and streams output via SSE.
 */
function agentRunnerPlugin() {
  return {
    name: "agent-runner",
    configureServer(server: any) {
      server.middlewares.use("/api/run-agent", async (req: any, res: any) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method not allowed");
          return;
        }

        // Parse body
        let body = "";
        for await (const chunk of req) {
          body += chunk;
        }
        let params: Record<string, string> = {};
        try {
          params = JSON.parse(body);
        } catch {
          // empty params
        }

        // Build command args
        const args = ["main.py"];
        if (params.sector) {
          args.push("--sector", params.sector);
        }
        if (params.date) {
          args.push("--date-start", params.date);
        }
        if (params.threshold) {
          args.push("--threshold", params.threshold);
        }
        if (params.thesis) {
          args.push("--thesis", params.thesis);
        }
        if (params.query) {
          args.push("--query", params.query);
        }

        // SSE headers
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        });

        const { spawn } = await import("child_process");
        const agentDir = path.resolve(__dirname, "..", "Agent");
        const child = spawn("python", args, {
          cwd: agentDir,
          env: { ...process.env, PYTHONIOENCODING: "utf-8" },
        });

        const sendEvent = (data: string) => {
          res.write(`data: ${JSON.stringify({ text: data })}\n\n`);
        };

        child.stdout.on("data", (chunk: Buffer) => {
          const text = chunk.toString();
          sendEvent(text);
        });

        child.stderr.on("data", (chunk: Buffer) => {
          const text = chunk.toString();
          sendEvent(text);
        });

        child.on("close", (code: number) => {
          res.write(
            `data: ${JSON.stringify({ done: true, exitCode: code })}\n\n`
          );
          res.end();
        });

        child.on("error", (err: Error) => {
          sendEvent(`ERROR: ${err.message}`);
          res.write(`data: ${JSON.stringify({ done: true, exitCode: 1 })}\n\n`);
          res.end();
        });

        // If client disconnects, kill the process
        req.on("close", () => {
          child.kill();
        });
      });
    },
  };
}
