const request = require("supertest");
const express = require("express");

jest.mock("../src/controllers/address.controller.js", () => ({
  CreateAddressController: jest.fn((req, res) =>
    res.status(200).json({
      message: "Address created successfully",
    }),
  ),
  GetDetailUserAddressController: jest.fn((req, res) => {
    res.status(200).json({
      message: "Data berhasil diambil",
      data: {
        uuid: "test-uuid-1",
        negara: "Indonesia",
        address: "Bandung, Jawa Barat, Indonesia",
        kota: "Bandung",
        provinsi: "Jawa Barat",
        kode_pos: "40391",
      },
    });
  }),
  DeleteDetailUserAddressController: jest.fn((req, res) => {
    res.status(200).json({
      message: "Berhasil dihapus",
    });
  }),
}));

// Mock jwt verification
jest.mock("../src/pkg/jwt/jwt.pkg", () => ({
  verifyLoginToken: jest.fn(),
}));

// Mock database model untuk validator
jest.mock("../src/models/index", () => ({
  TblAddressUsers: {
    findOne: jest.fn(),
  },
}));

const { verifyLoginToken } = require("../src/pkg/jwt/jwt.pkg");
const { TblAddressUsers } = require("../src/models/index");
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
    });

    it("harus mengembalikan 200 jika semua field terisi", async () => {
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
      expect(res.status).toBe(200);
    });
  });
});
