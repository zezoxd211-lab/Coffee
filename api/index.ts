import express from "express";
import type { Request, Response } from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(
    express.json({
        verify: (req: any, _res: any, buf: any) => {
            req.rawBody = buf;
        },
    })
);
app.use(express.urlencoded({ extended: false }));

// CORS headers for Vercel
app.use((_req: any, res: any, next: any) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (_req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    next();
});

app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
        ok: true,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || "unknown",
        node: process.version,
    });
});

// Statically initialize routes so Vercel traces dependencies at build-time.
// By capturing any initialization errors, we avoid blowing up the lambda runtime 
// immediately, and can report them at request-time instead.
let isReady = false;
let bootError: any = null;

registerRoutes(null as any, app).then(() => {
    isReady = true;
    console.log("Routes registered for Vercel Serverless");
}).catch(err => {
    bootError = err;
    console.error("Vercel Route Boot Crash:", err);
});

export default function handler(req: Request, res: Response) {
    if (bootError) {
        return res.status(500).json({
            error: "VERCEL_BOOT_CRASH",
            message: bootError?.message || String(bootError),
            stack: bootError?.stack,
        });
    }

    // Pass the request to Express
    app(req, res);
}
