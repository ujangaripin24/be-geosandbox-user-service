const request = require("supertest");
const express = require("express");
const { version } = require("../package.json");

// Mock controller agar unit test fokus pada routing, middleware, dan response status
jest.mock("../src/controllers/user.controller", () => ({
  GetAllUsersController: jest.fn((req, res) =>
    res.status(200).json({
      message: "Get All Users",
      data: [{ uuid: "test-uuid-1", username: "user1" }],
    }),
  ),
  GetUserDetailController: jest.fn((req, res) =>
    res.status(200).json({
      message: "Get User Detail",
      data: { uuid: req.params.uuid, username: "user1" },
    }),
  ),
  UserUpdateController: jest.fn((req, res) =>
    res.status(200).json({
      message: "User updated successfully",
    }),
  ),
}));

// Mock jwt verification
jest.mock("../src/pkg/jwt/jwt.pkg", () => ({
  verifyLoginToken: jest.fn(),
}));

// Mock database model untuk validator
jest.mock("../src/models/index", () => ({
  DetailUsers: {
    findOne: jest.fn(),
  },
}));

const { verifyLoginToken } = require("../src/pkg/jwt/jwt.pkg");
const { DetailUsers } = require("../src/models/index");
const {
  GetAllUsersController,
  GetUserDetailController,
  UserUpdateController,
} = require("../src/controllers/user.controller");
const userRouter = require("../src/routes/user.route");

const app = express();
app.use(express.json());
app.use(userRouter);
app.use("/api/v1", userRouter);

describe("User Routes Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /users/health", () => {
    it("harus mengembalikan status 200 beserta versionApp", async () => {
      const res = await request(app).get("/users/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          versionApp: version,
          message: "[SERVICE-USER] Server Berhasil Berjalan",
          date: expect.any(String),
        }),
      );
    });
  });

  describe("GET /user/profile/admin", () => {
    it("harus mengembalikan 400 jika token tidak disertakan", async () => {
      const res = await request(app).get("/user/profile/admin");

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("harus mengembalikan 403 jika token tidak valid atau kadaluarsa", async () => {
      verifyLoginToken.mockImplementation(() => {
        throw new Error("Token expired");
      });

      const res = await request(app)
        .get("/user/profile/admin")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("errors");
    });

    it("harus mengembalikan 403 jika role pengguna bukan admin", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "user-uuid-1",
        role: "user",
      });

      const res = await request(app)
        .get("/user/profile/admin")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("errors");
    });

    it("harus mengembalikan 200 jika role pengguna adalah admin", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "admin-uuid-1",
        role: "admin",
      });

      const res = await request(app)
        .get("/user/profile/admin")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: "Admin role access",
      });
    });
  });

  describe("GET /user/profile/user", () => {
    it("harus mengembalikan 400 jika token tidak disertakan", async () => {
      const res = await request(app).get("/user/profile/user");

      expect(res.status).toBe(400);
    });

    it("harus mengembalikan 403 jika role pengguna bukan user", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "guest-uuid-1",
        role: "guest",
      });

      const res = await request(app)
        .get("/user/profile/user")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(403);
    });

    it("harus mengembalikan 200 jika role pengguna adalah user", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "user-uuid-1",
        role: "user",
      });

      const res = await request(app)
        .get("/user/profile/user")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: "User role access",
      });
    });
  });

  describe("GET /users/get-all", () => {
    it("harus memanggil GetAllUsersController dan mengembalikan status 200", async () => {
      const res = await request(app).get("/users/get-all");

      expect(res.status).toBe(200);
      expect(GetAllUsersController).toHaveBeenCalledTimes(1);
      expect(res.body).toHaveProperty("data");
    });
  });

  describe("GET /users/detail/:uuid", () => {
    it("harus mengembalikan 400 jika tidak ada token otentikasi", async () => {
      const res = await request(app).get("/users/detail/123-uuid");

      expect(res.status).toBe(400);
    });

    it("harus memanggil GetUserDetailController dan mengembalikan 200 jika token valid", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "123-uuid",
        role: "user",
      });

      const res = await request(app)
        .get("/users/detail/123-uuid")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(GetUserDetailController).toHaveBeenCalledTimes(1);
    });
  });

  describe("PUT /users/update", () => {
    it("harus mengembalikan 400 jika tidak ada token otentikasi", async () => {
      const res = await request(app)
        .put("/users/update")
        .send({ username: "newusername" });

      expect(res.status).toBe(400);
    });

    it("harus mengembalikan 400 jika format email tidak valid", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "123-uuid",
        role: "user",
      });

      const res = await request(app)
        .put("/users/update")
        .set("Authorization", "Bearer valid-token")
        .send({ email: "invalid-email-format" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
      expect(UserUpdateController).not.toHaveBeenCalled();
    });

    it("harus memanggil UserUpdateController dan mengembalikan 200 jika validasi dan token sukses", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "123-uuid",
        role: "user",
      });
      DetailUsers.findOne.mockResolvedValue(null);

      const res = await request(app)
        .put("/users/update")
        .set("Authorization", "Bearer valid-token")
        .send({
          email: "user@example.com",
          username: "validusername",
        });

      expect(res.status).toBe(200);
      expect(UserUpdateController).toHaveBeenCalledTimes(1);
    });
  });
});
