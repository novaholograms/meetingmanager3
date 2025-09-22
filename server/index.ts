import dotenv from "dotenv";

// Load environment variables first, before any other imports
dotenv.config();

import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
// Import database and auth conditionally to avoid connection errors
let db, setupAuth;
try {
  const dbModule = await import("./db.js");
  db = dbModule.db;
  const authModule = await import("./auth.js");
  setupAuth = authModule.setupAuth;
} catch (error) {
  console.warn("Database connection failed, running without database:", error.message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? process.env.BASE_URL || "https://consultator.replit.app"
    : "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Setup authentication
if (setupAuth) {
  setupAuth();
}

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "../dist/public")));
} else {
  // In development, serve static files if they exist
  const staticPath = join(__dirname, "../dist/public");
  if (existsSync(staticPath)) {
    app.use(express.static(staticPath));
  }
}

// API Routes placeholder
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Authentication routes
app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user });
});

app.post("/api/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

app.get("/api/auth/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// WebSocket handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received:', data);
      
      // Echo back for now
      ws.send(JSON.stringify({ type: 'echo', data }));
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Catch-all handler for SPA in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    const indexPath = join(__dirname, "../dist/public/index.html");
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "Frontend not built yet. Run 'npm run build' first." });
    }
  });
} else {
  // In development, serve the built frontend if available
  app.get("/", (req, res) => {
    const indexPath = join(__dirname, "../dist/public/index.html");
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.json({
        message: "Development server running",
        note: "Frontend not built yet. Run 'npm run build' to build the frontend.",
        api: "API available at /api/*",
        health: "/api/health"
      });
    }
  });
  
  // Catch-all for SPA routes in development
  app.get("*", (req, res) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'API endpoint not found' });
    } else {
      const indexPath = join(__dirname, "../dist/public/index.html");
      if (existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ error: "Page not found. Frontend not built yet." });
      }
    }
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;