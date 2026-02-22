import express from "express";
import type { Request, Response } from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(
    express.json({
        verify: (req: any, _res, buf) => {
            req.rawBody = buf;
        },
    })
);

app.use(express.urlencoded({ extended: false }));

// CORS headers for Vercel
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (_req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    next();
});

// Health check / debug endpoint — shows what version of the function is running
app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
        ok: true,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || "unknown",
        node: process.version,
    });
});

// Initialize routes — must be awaited so all app.get() handlers are registered
// before Vercel serves requests. We use a lazy-init pattern to handle the async nature.
let routesReady = false;
let routesInitPromise: Promise<void> | null = null;

async function initRoutes() {
    if (routesReady) return;
    if (!routesInitPromise) {
        routesInitPromise = registerRoutes(null as any, app)
            .then(() => { routesReady = true; })
            .catch((err) => {
                console.error("registerRoutes failed:", err);
                routesInitPromise = null; // allow retry
            });
    }
    await routesInitPromise;
}

// Middleware that ensures routes are registered before any /api/* request
app.use(async (_req, _res, next) => {
    try {
        await initRoutes();
    } catch (err) {
        console.error("Route init error:", err);
    }
    next();
});

// Kick off route registration immediately (don't wait for first request)
initRoutes().catch(console.error);

export default app;
