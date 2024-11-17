import express from "express";
import env from "dotenv";
env.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Auth System through Typescript");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
