require("dotenv").config();

const fs = require("fs");
const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001/");
});

app.post(
  "/api/login",
  body("user").notEmpty().isString(),
  body("password").notEmpty().isString(),
  (req, res) => {
    const { user, password } = req.body;

    const passwordHashed = bcrypt.hashSync(password, process.env.SALT);

    let users = [];
    if (fs.existsSync("users.txt")) {
      users = JSON.parse(fs.readFileSync("users.txt", "utf-8"));
    }
    const pwdFromDB = users.find((u) => u.user === user)?.password ?? null;

    if (pwdFromDB !== passwordHashed) {
      res.writeHead(401);
      res.end();
      return;
    }

    const payload = {
      user: req.body.user,
      role: "user",
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res
      .writeHead(200, {
        "Content-Type": "text/plain",
      })
      .end(token);
  }
);

app.post(
  "/api/user",
  body("user").notEmpty().isString(),
  body("password").notEmpty().isString(),
  (req, res) => {
    const { user, password } = req.body;

    console.log(password, process.env.SALT);
    const passwordToSave = bcrypt.hashSync(password, process.env.SALT);
    let users = [];
    if (fs.existsSync("users.txt")) {
      users = JSON.parse(fs.readFileSync("users.txt", "utf-8"));
    }

    users.push({ user, password: passwordToSave });
    fs.writeFileSync("users.txt", JSON.stringify(users));
    res.writeHead(201).end();
  }
);

app.post("/api/secret", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Bearer [token]

  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      res.writeHead(401);
      res.end("Not authorized");
      return;
    }
    if (payload.role !== "admin") {
      res.writeHead(401);
      res.end("Unauthorized");
      return;
    }
    res.end("welcome to the secret admin area");
  });
});
