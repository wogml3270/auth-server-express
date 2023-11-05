module.exports = [
  {
    users: [
      {
        id: "user_01",
        username: "user1",
        password: "password1",
        membership: {
          membershipId: "001",
          name: "라이트",
        },
      },
      {
        id: "user_02",
        username: "user2",
        password: "password2",
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
        features: ["기본적인 컨텐츠 접근 권한"],
      },
      {
        id: "002",
        name: "프리미엄",
        features: ["전체 컨텐츠 접근 권한", "특별 혜택"],
      },
    ],
    content: [
      {
        id: "content_01",
        title: "Basic Content",
        membershipRequired: "001",
      },
      {
        id: "content_02",
        title: "Premium Content",
        membershipRequired: "002",
      },
    ],
    auth: {
      accessToken: "access_token",
      refreshToken: "refresh_token",
    },
  },
];
