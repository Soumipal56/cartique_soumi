import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRouter from "./routes/auth.routes.js"

const app = express();

// Global Middlewares
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(cookieParser()); // Cookie parser middleware

// Base API route for healthcheck/testing
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Routes
app.use("/api/auth", authRouter);

export default app;
