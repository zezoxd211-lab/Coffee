import express from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();

app.use(
    express.json({
        verify: (req: any, _res, buf) => {
            req.rawBody = buf;
        },
    })
);

app.use(express.urlencoded({ extended: false }));

// Add CORS headers for Vercel deployment
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

const httpServer = createServer(app);
registerRoutes(httpServer, app);

export default app;
