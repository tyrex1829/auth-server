import express from "express";
import env from "dotenv";
env.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

app.post("/signup", async (req, res): Promise<any> => {
  const { username, password } = req.body;

  const user = users.find((u: any) => u.username === username);
  if (user) {
    return res.status(500).json({
      message: "Can't signup username already present",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({
    username,
    password: hashedPassword,
  });
  return res.send({
    message: "You have signed up",
  });
});

app.post("/signin", async (req, res): Promise<any> => {
  const { username, password } = req.body;

  const user = users.find((u: any) => u.username === username);

  if (!user) {
    return res.status(400).json({
      message: `Invalid username.`,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      message: `Invalid password.`,
    });
  }

  const token = jwt.sign(
    {
      username: user.username,
    },
    JWT_SECRET
  );
  user.token = token;
  return res.status(200).json({
    token: token,
    message: `Login successful`,
  });
});

function auth(req: any, res: any, next: any): any {
  const token: any = req.headers.authorization;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          message: `Unauthorized`,
        });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({
      message: `Unauthorized`,
    });
  }
}

app.get("/me", auth, (req, res): any => {
  const user = req.user;

  return res.status(200).json({
    message: user.username,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
