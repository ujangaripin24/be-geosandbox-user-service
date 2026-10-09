const request = require("supertest");
const express = require("express");

jest.mock("../src/controllers/address.controller.js", () => ({
  CreateAddressController: jest.fn((req, res) =>
    res.status(201).json({
      message: "Alamat berhasil ditambahkan.",
    }),
  ),
  GetDetailUserAddressController: jest.fn((req, res) =>
    res.status(200).json({
      message: "Data berhasil diambil.",
      data: {
        uuid: "address-uuid-1",
        negara: "Indonesia",
        address: "Bandung, Jawa Barat, Indonesia",
        kota: "Bandung",
        provinsi: "Jawa Barat",
        kode_pos: "40391",
      },
    }),
  ),
  DeleteDetailUserAddressController: jest.fn((req, res) =>
    res.status(200).json({
      message: "Berhasil dihapus",
    }),
  ),
}));

// Mock jwt verification
jest.mock("../src/pkg/jwt/jwt.pkg", () => ({
  verifyLoginToken: jest.fn(),
}));

// Mock database model untuk middleware checkAddressOwnership
jest.mock("../src/models/index", () => ({
  TblAddressUsers: {
    findOne: jest.fn(),
  },
}));

const { verifyLoginToken } = require("../src/pkg/jwt/jwt.pkg");
const { TblAddressUsers } = require("../src/models/index");
const {
  CreateAddressController,
  GetDetailUserAddressController,
  DeleteDetailUserAddressController,
} = require("../src/controllers/address.controller");
const addressRouter = require("../src/routes/address.route");

const app = express();
app.use(express.json());
app.use(addressRouter);
app.use("/api/v1", addressRouter);

describe("AddressRoutes Unit Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /user/create-address", () => {
    it("harus mengembalikan 400 jika tidak ada token otentikasi", async () => {
      const res = await request(app).post("/user/create-address").send({
        negara: "Indonesia",
        address: "Jl. Merdeka No. 123",
        kota: "Jakarta",
        provinsi: "DKI Jakarta",
        kode_pos: "12345",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
      expect(CreateAddressController).not.toHaveBeenCalled();
    });

    it("harus mengembalikan 403 jika token otentikasi tidak valid atau kadaluarsa", async () => {
      verifyLoginToken.mockImplementation(() => {
        throw new Error("Token expired");
      });

      const res = await request(app)
        .post("/user/create-address")
        .set("Authorization", "Bearer invalid-token")
        .send({
          negara: "Indonesia",
          address: "Jl. Merdeka No. 123",
          kota: "Jakarta",
          provinsi: "DKI Jakarta",
          kode_pos: "12345",
        });

      expect(res.status).toBe(403);
      expect(CreateAddressController).not.toHaveBeenCalled();
    });

    it("harus mengembalikan 400 jika validasi field gagal (field kosong)", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "user-uuid-1",
        role: "user",
      });

      const res = await request(app)
        .post("/user/create-address")
        .set("Authorization", "Bearer valid-token")
        .send({
          negara: "",
          address: "",
          kota: "",
          provinsi: "",
          kode_pos: "",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors.length).toBeGreaterThan(0);
      expect(CreateAddressController).not.toHaveBeenCalled();
    });

    it("harus memanggil CreateAddressController dan mengembalikan 201 jika semua field valid", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "user-uuid-1",
        role: "user",
      });

      const res = await request(app)
        .post("/user/create-address")
        .set("Authorization", "Bearer valid-token")
        .send({
          negara: "Indonesia",
          address: "Jl. Merdeka No. 123",
          kota: "Jakarta",
          provinsi: "DKI Jakarta",
          kode_pos: "12345",
        });

      expect(res.status).toBe(201);
      expect(CreateAddressController).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /user/address", () => {
    it("harus mengembalikan 400 jika tidak ada token otentikasi", async () => {
      const res = await request(app).get("/user/address");

      expect(res.status).toBe(400);
      expect(GetDetailUserAddressController).not.toHaveBeenCalled();
    });

    it("harus mengembalikan 403 jika token otentikasi tidak valid", async () => {
      verifyLoginToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const res = await request(app)
        .get("/user/address")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(403);
      expect(GetDetailUserAddressController).not.toHaveBeenCalled();
    });

    it("harus memanggil GetDetailUserAddressController dan mengembalikan 200 beserta data alamat jika token valid", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "user-uuid-1",
        role: "user",
      });

      const res = await request(app)
        .get("/user/address")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(GetDetailUserAddressController).toHaveBeenCalledTimes(1);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.kota).toBe("Bandung");
    });
  });

  describe("DELETE /user/address/delete/:uuid", () => {
    it("harus mengembalikan 400 jika tidak ada token otentikasi", async () => {
      const res = await request(app).delete("/user/address/delete/addr-uuid-1");

      expect(res.status).toBe(400);
      expect(DeleteDetailUserAddressController).not.toHaveBeenCalled();
    });

    it("harus mengembalikan 403 jika token otentikasi tidak valid", async () => {
      verifyLoginToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const res = await request(app)
        .delete("/user/address/delete/addr-uuid-1")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(403);
      expect(DeleteDetailUserAddressController).not.toHaveBeenCalled();
    });

    it("harus mengembalikan 404 jika address tidak ditemukan di database", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "user-uuid-1",
        role: "user",
      });
      TblAddressUsers.findOne.mockResolvedValue(null);

      const res = await request(app)
        .delete("/user/address/delete/not-found-uuid")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(404);
      expect(TblAddressUsers.findOne).toHaveBeenCalledWith({
        where: { uuid: "not-found-uuid" },
      });
      expect(DeleteDetailUserAddressController).not.toHaveBeenCalled();
    });

    it("harus mengembalikan 403 jika address bukan milik user yang login (forbidden)", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "user-uuid-1",
        role: "user",
      });
      TblAddressUsers.findOne.mockResolvedValue({
        uuid: "addr-uuid-1",
        uuid_user: "other-user-uuid",
      });

      const res = await request(app)
        .delete("/user/address/delete/addr-uuid-1")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(403);
      expect(DeleteDetailUserAddressController).not.toHaveBeenCalled();
    });

    it("harus mengembalikan 500 jika database mengalami kesalahan pada middleware", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "user-uuid-1",
        role: "user",
      });
      TblAddressUsers.findOne.mockRejectedValue(new Error("Database connection error"));

      const res = await request(app)
        .delete("/user/address/delete/addr-uuid-1")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(500);
      expect(DeleteDetailUserAddressController).not.toHaveBeenCalled();
    });

    it("harus memanggil DeleteDetailUserAddressController dan mengembalikan 200 jika address milik user yang login", async () => {
      verifyLoginToken.mockReturnValue({
        uuid: "user-uuid-1",
        role: "user",
      });
      TblAddressUsers.findOne.mockResolvedValue({
        uuid: "addr-uuid-1",
        uuid_user: "user-uuid-1",
      });

      const res = await request(app)
        .delete("/user/address/delete/addr-uuid-1")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(DeleteDetailUserAddressController).toHaveBeenCalledTimes(1);
    });
  });
});
