import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// common middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import healthcheckRoutes from "./routes/healthcheck.routes.js";
import userRoutes from "./routes/user.routes.js";
import googleAuthRoutes from "./routes/googleAuth.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";

// routes
app.use("/api/v1/healthcheck", healthcheckRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users", googleAuthRoutes);

app.use(errorHandler);
export { app };
