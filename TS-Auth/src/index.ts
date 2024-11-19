import express from "express";
import env from "dotenv";
env.config();
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 3000;

let users: any = [];

const JWT_SECRET: any = process.env.JWT_SECRET;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Auth System through Typescript");
});

app.get("/users", (req, res): any => {
  try {
    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(400).json({
      message: `Can't fetch users right now`,
    });
  }
});

app.post("/signup", (req, res): any => {
  const { username, password } = req.body;

  const user = users.find((u: any) => u.username === username);
  if (user) {
    return res.status(500).json({
      message: "Can't signup username already present",
    });
  } else {
    users.push({
      username,
      password,
    });
    return res.send({
      message: "You have signed up",
    });
  }
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u: any) => u.username === username && u.password === password
  );

  if (user) {
    const token = jwt.sign(
      {
        username: user.username,
      },
      JWT_SECRET
    );
    user.token = token;
    res.status(200).json({
      token,
    });
  } else {
    res.status(403).send({
      message: `Invalid username or password`,
    });
  }
});

app.get("/me", (req, res) => {
  const token: any = req.headers.authorization;
  const userDetails = jwt.verify(token, JWT_SECRET);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
