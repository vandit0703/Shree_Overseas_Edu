import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import path from "path";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { getApiServerDir } from "./lib/paths";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files — process.cwd() = artifacts/api-server/ when started via pnpm
const packageDir = getApiServerDir(import.meta.url);
const uploadsDir = path.join(packageDir, "uploads");
app.use("/api/uploads", express.static(uploadsDir));

app.use("/api", router);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, "Unhandled API error");

  const message =
    err instanceof Error && process.env.NODE_ENV !== "production"
      ? err.message
      : "Internal server error";

  res.status(500).json({ error: message });
});

export default app;
