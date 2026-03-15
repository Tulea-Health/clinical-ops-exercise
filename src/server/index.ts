import path from "path";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import http from "http";
import { errors } from "celebrate";
import routes from "./routes/v1/index.js";
import { securityMiddleware, requestLogger } from "./middleware/security.js";
import config from "./config/index.js";

// ============================================================================
// Express App Setup
// ============================================================================

const app = express();

app.use(securityMiddleware);
app.use(requestLogger);
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
app.use(errors());

// ============================================================================
// API Routes
// ============================================================================

app.use("/api/v1/", routes);

// ============================================================================
// Frontend Routes (SPA Support)
// ============================================================================

app.get("/", (_req: Request, res: Response) => {
  if (config.isDevelopment) {
    res.redirect("http://localhost:3000");
  } else {
    res.sendFile(path.resolve("dist", "index.html"));
  }
});

app.get("/*splat", (_req: Request, res: Response) => {
  res.sendFile(path.resolve("dist", "index.html"));
});

// ============================================================================
// Error Handling
// ============================================================================

interface HttpError extends Error {
  status?: number;
}

app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: config.isDevelopment
      ? err.message
      : "An unexpected error occurred",
    ...(config.isDevelopment && { stack: err.stack }),
  });
});

// ============================================================================
// Server Startup
// ============================================================================

const httpServer = http.createServer(app);

httpServer.listen(config.port, () => {
  console.log(`
🚀 Server running on port ${config.port}
📦 Environment: ${config.nodeEnv}
🔗 API: http://localhost:${config.port}/api/v1
${config.isDevelopment ? "🛠️  Development mode - hot reload enabled" : ""}
  `);
});

// ============================================================================
// Graceful Shutdown
// ============================================================================

const shutdown = (signal: string): void => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  httpServer.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
