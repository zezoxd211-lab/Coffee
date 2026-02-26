// Safe boot-loader for Vercel
import type { Request, Response } from "express";

let globalApp: any = null;

export default async function handler(req: Request, res: Response) {
    try {
        if (!globalApp) {
            // Dynamically import everything so crashes are caught in the try/catch
            const express = require("express");
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

            // Synchronously require routes so Vercel traces dependencies easily, 
            // but inside the function so it doesn't crash the lambda on module load!
            const { registerRoutes } = require("../server/routes");

            await registerRoutes(null as any, app);
            globalApp = app;
        }

        // Pass the request to the cached express instance
        globalApp(req, res);

    } catch (err: any) {
        // If anything fails during boot (e.g. strict dependency, syntax error), spit it out directly to Vercel page!
        res.status(500).json({
            error: "VERCEL_BOOT_CRASH",
            message: err?.message || String(err),
            stack: err?.stack,
            name: err?.name
        });
    }
}
