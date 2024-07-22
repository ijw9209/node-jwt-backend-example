// app.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const port = 8000;
const secretKey = process.env.NODE_AUTH_SECRET; // 비밀 키

// console.log("node auth ", process.env.NODE_AUTH_SECRET);
app.use(express.json());

const users = [
  {
    id: 1,
    username: "user1",
    password: bcrypt.hashSync("password1", 8), // 실제 애플리케이션에서는 DB에 저장
  },
];

// 로그인 엔드포인트
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  console.log(user);

  if (!user) {
    return res.status(404).send("User not found");
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    return res.status(401).send("Invalid Password");
  }

  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: 86400 }); // 24시간 유효한 토큰

  res.status(200).send({ auth: true, token });
});

// 인증 미들웨어
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("No token provided");
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).send("Failed to authenticate token");
    }

    req.userId = decoded.id;
    next();
  });
};

// 보호된 엔드포인트
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).send(`Hello User ${req.userId}, you are authenticated`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
