import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ All routes go through here
app.use("/api", routes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;