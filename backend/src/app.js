const express = require("express");
const apiRouter = require("./routes");

const app = express();

app.use(express.json());

app.get("/home", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error.",
  });
});

module.exports = app;
