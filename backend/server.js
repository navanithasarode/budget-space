require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "budget-space-api" }));
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/budgets", require("./routes/budgets"));
app.use("/api/v1/expenses", require("./routes/expenses"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

const dbReady = connectDB();

app.use(async (req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 5000;

  dbReady
    .then(() => {
      app.listen(port, () => {
        console.log(`API running on http://localhost:${port}`);
      });
    })
    .catch(err => {
      console.error("Database connection failed:", err.message);
      process.exit(1);
    });
}
