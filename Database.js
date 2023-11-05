module.exports = {
  users: [
    {
      id: 1,
      username: "user1",
      password: "11",
      membership: {
        membershipId: "001",
        name: "라이트",
      },
    },
    {
      id: 2,
      username: "user2",
      password: "22",
      membership: {
        membershipId: "002",
        name: "프리미엄",
      },
    },
  ],
  memberships: [
    {
      id: "001",
      name: "라이트",
      features: ["기본적인 컨텐츠 접근 권한", "기본 혜택"],
    },
    {
      id: "002",
      name: "프리미엄",
      features: ["전체 컨텐츠 접근 권한", "특별 혜택"],
    },
  ],
  content: [
    {
      id: 1,
      title: "Basic Content",
      membershipRequired: "001",
    },
    {
      id: 2,
      title: "Premium Content",
      membershipRequired: "002",
    },
  ],
  auth: {
    accessToken: "access_token",
    refreshToken: "refresh_token",
  },
};
