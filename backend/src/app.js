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
import vendorRoutes from "./routes/vendor.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import roleRoutes from "./routes/role.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";

// routes
app.use("/api/v1/healthcheck", healthcheckRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users", googleAuthRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/roles", roleRoutes);

app.use(errorHandler);
export { app };
