import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRouter from "./routes/auth.routes.js"
import productRouter from "./routes/product.routes.js"
import cors from "cors"
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './config/config.js';

const app = express();

// Global Middlewares
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(cookieParser()); // Cookie parser middleware
app.use(cors({
  origin:"http://localhost:5173",
  methods:["GET","POST","PUT","DELETE"],
  credentials:true
})); // Cross-Origin Resource Sharing middleware
app.use(passport.initialize());
passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}))

// Base API route for healthcheck/testing
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

export default app;
