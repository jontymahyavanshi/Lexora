import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// 🌐 Middlewares
app.use(cors());
app.use(express.json());

// 🔗 Routes
app.use("/api", routes);

// 🧪 Health check
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// ❌ 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// 🚨 Global Error Handler
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("GLOBAL ERROR:", err);

    res.status(err.status || 500).json({
      message: err.message || "Something went wrong",
    });
  }
);

export default app;