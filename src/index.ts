import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the TDD Server! 🛠️");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
