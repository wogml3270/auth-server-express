// server/index.js
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// 환경 변수 및 더미 데이터 불러오기
require("dotenv").config();
const dummyData = require("./Database");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// CORS 설정
app.use(cors());

// JSON 파싱을 위한 미들웨어
app.use(express.json());

// 컨트롤러 가져오기
const {
  authenticateUser,
  getUserInfo,
  refreshAuthToken,
} = require("./controller");

// 로그인 미들웨어
const requireLogin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// 로그인 라우트
app.post("auth/login", authenticateUser);

// 사용자 정보를 불러오는 라우트
app.get("/user/me", requireLogin, getUserInfo);

// 토큰을 재발급하는 라우트
app.post("/auth/refresh", refreshAuthToken);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
