const express = require("express");

const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );

const SECRET_KEY =
  "3a7fd646d03adf62a8b1402bec1b487aef993073657faba7153fc52dbb62366c6ec5d6c0eacfbbbdf2bdc1cb707c374b";

app.post("/api/login", (req, res) => {
  const payload = {
    user: req.body.user,
    role: "user",
  };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1h",
  });

  res.end(token);
});

app.post("/api/secret", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Bearer [token]

  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err) {
      res.writeHead(401);
      res.end("Not authorized");
      return;
    }
    console.log(payload);
    if (payload.role !== "admin") {
      res.writeHead(401);
      res.end("Unauthorized");
      return;
    }
    res.end("welcome to the secret area");
  });
});
