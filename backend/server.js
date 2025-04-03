require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoute");
const gameRoutes = require("./src/routes/gameRoute");
const contactRoutes = require("./src/routes/contactRoute");

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

// --- Request Logger Middleware (Add this first) ---
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.path}`);
  next();
});
// -----------------------------------------------

// Define allowed origins
const allowedOrigins = [
  "http://localhost:4200",
  "http://www.dsp5-archi-f24a-15m-g8.fr",
  "https://www.dsp5-archi-f24a-15m-g8.fr",
];

// CORS Options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middlewares
app.use(express.json());
// Use the specific CORS options again
app.use(cors(corsOptions));

// Routes
app.get("/api/hello", (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

// Adjust API base path
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/contact", contactRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur port ${PORT} derrière Traefik`);
  });
}

module.exports = app;
