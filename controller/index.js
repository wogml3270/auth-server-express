// controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // 실제 서비스에서는 안전한 곳에 보관

// 데이터베이스 더미 데이터
const USERS = require("../Database").users;
const MEMBERSHIPS = require("../Database").memberships;

// 비밀번호 검증 함수
const validatePassword = (inputPassword, storedPassword) => {
  // 실제 어플리케이션에서는 bcrypt와 같은 라이브러리를 사용해 암호화된 비밀번호를 비교합니다.
  return bcrypt.compareSync(inputPassword, storedPassword);
};

// 사용자 인증 (로그인) 함수
const authenticateUser = (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find((user) => user.username === username);
  if (user && validatePassword(password, user.password)) {
    const accessToken = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      txId: "unique_transaction_id",
      data: {
        userId: user.id,
        username: user.username,
        membership: user.membership,
        accessToken,
        refreshToken,
      },
    });
  }
  return res.status(401).json({
    txId: "unique_transaction_id",
    error: {
      message: "Invalid username or password",
    },
  });
};

// 사용자 정보 가져오기
const getUserInfo = (req, res) => {
  const user = USERS.find((user) => user.id === req.user.userId);
  if (!user) {
    return res.status(401).json({
      txId: "unique_transaction_id",
      error: {
        message: "User not found",
      },
    });
  }
  const membership = MEMBERSHIPS.find(
    (m) => m.id === user.membership.membershipId
  );

  res.json({
    txId: "unique_transaction_id",
    data: {
      userId: user.id,
      username: user.username,
      membership: membership || user.membership,
    },
  });
};

// 토큰 재발급
const refreshAuthToken = (req, res) => {
  // Refresh Token 검증 로직을 여기에 구현
  // 예제에서는 간단한 검증을 위해 더미 데이터의 refreshToken을 검사
  const { refreshToken } = req.body;
  if (refreshToken !== "refresh_token") {
    return res.status(401).json({
      txId: "unique_transaction_id",
      error: {
        message: "Invalid refresh token",
      },
    });
  }

  // 여기서는 단순히 user1의 정보를 사용합니다.
  const user = USERS.find((u) => u.username === "user1");
  if (!user) {
    return res.status(401).json({
      txId: "unique_transaction_id",
      error: {
        message: "User not found",
      },
    });
  }

  const newAccessToken = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    txId: "unique_transaction_id",
    data: {
      userId: user.id,
      accessToken: newAccessToken,
      refreshToken: refreshToken, // 실제로는 새로 발급되는 refreshToken을 보내야 합니다.
    },
  });
};

module.exports = {
  authenticateUser,
  getUserInfo,
  refreshAuthToken,
};
