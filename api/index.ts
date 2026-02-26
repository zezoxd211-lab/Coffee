import express from "express";
import type { Request, Response } from "express";

const app = express();

app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
        ok: true,
        test: "DATABASE BYPASSED",
        timestamp: new Date().toISOString()
    });
});

export default function handler(req: Request, res: Response) {
    app(req, res);
}
