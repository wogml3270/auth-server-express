const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // 실제 서비스에서는 안전한 곳에 보관

// 데이터베이스 더미 데이터
const USERS = require("../Database").users;
const MEMBERSHIPS = require("../Database").memberships;

// 사용자 인증 (로그인) 함수
const authenticateUser = (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find((user) => user.username === username);
  if (user && password === user.password) {
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
  const { refreshToken } = req.body;

  // USERS 배열에서 refreshToken과 일치하는 사용자를 찾습니다.
  const user = USERS.find((u) => u.refreshToken === refreshToken);
  if (!user) {
    return res.status(401).json({
      txId: "unique_transaction_id",
      error: {
        message: "유효하지 않은 토큰입니다.",
      },
    });
  }

  // 사용자가 유효한 경우 새로운 액세스 토큰을 생성합니다.
  const newAccessToken = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1s" }
  );

  // 새로운 액세스 토큰과 함께 응답을 반환합니다.
  res.json({
    txId: "unique_transaction_id",
    data: {
      userId: user.id,
      accessToken: newAccessToken,
      refreshToken: user.refreshToken, // 여기서는 기존 refreshToken을 반환하고 있습니다.
    },
  });
  console.log(refreshToken);
};

module.exports = {
  authenticateUser,
  getUserInfo,
  refreshAuthToken,
};
