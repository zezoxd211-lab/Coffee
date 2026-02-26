// Dynamic-Load wrapper for Vercel Serverless
// This entirely prevents the module from executing ANY external code until invoked.
import type { Request, Response } from "express";

let globalApp: any = null;

export default async function handler(req: Request, res: Response) {
    try {
        if (!globalApp) {
            // Require dynamically AT RUNTIME to catch require() chain crashes
            const express = require("express");
            const app = express();

            app.use(express.json());
            app.use(express.urlencoded({ extended: false }));

            // CORS
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
                res.json({ ok: true, msg: "Lazy loaded health check" });
            });

            const { registerRoutes } = require("../server/routes");

            await registerRoutes(null as any, app);
            globalApp = app;
        }

        globalApp(req, res);
    } catch (e: any) {
        return res.status(500).json({
            error: "DYNAMIC_REQUIRE_FAIL",
            message: e.message || String(e),
            stack: e.stack
        });
    }
}
