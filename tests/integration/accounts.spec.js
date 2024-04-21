const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let user;
let account; 

describe("test POST /api/v1/accounts endpoint", () => {
  
  beforeAll(async () => {
    user = await prisma.user.findMany();
  });

  test("test membuat account baru by userId -> sukses", async () => {
    try {
      let bank_name = "bankName1234";
      let bank_account_number = "0012345";
      let balance = 1000000;
      let userId = user[0].id;
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, userId });
      console.log(body);
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("userId");
      expect(body.data.bank_name).toBe(bank_name);
      expect(body.data.bank_account_number).toBe(bank_account_number);
      expect(body.data.balance).toBe(balance);
      expect(body.data.userId).toBe(userId);
    } catch (err) {
      throw err;
    }
  });

  test("test All input fields are required-> error (400)", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({});
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("test Bank account number already exists -> error (401)", async () => {
    try {
      let bank_name = "bankName123";
      let bank_account_number = "0012345";
      let balance = 1000000;
      let userId = user[0].id;
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, userId });
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("test User with id ${userId} not found -> error (404)", async () => {
    try {
      const requestData = {
        bank_name: "BRI",
        bank_account_number: "00123",
        balance: 10000,
        userId: 1, // ID pengguna tidak valid
      };

      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send(requestData)

      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

describe("test GET /api/v1/accounts endpoint", () => {

  test("test menampilkan semua accounts yang sudah terdaftar -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get("/api/v1/accounts");
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("bank_name");
      expect(body.data[0]).toHaveProperty("bank_account_number");
      expect(body.data[0]).toHaveProperty("balance");
      expect(body.data[0]).toHaveProperty("userId");
    } catch (err) {
      throw err;
    }
  });


});

describe("test GET /api/v1/accounts/:id endpoint", () => {
  beforeAll(async () => {
    account = await prisma.bank_Accounts.findMany();
  });
  test("test menampilkan detail account by id -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/accounts/${account[0].id}`
      );
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("userId");
      expect(body.data).toHaveProperty("User");
      expect(body.data.User).toHaveProperty("id"); 
      expect(body.data.User).toHaveProperty("name");
      expect(body.data.User).toHaveProperty("email");
      expect(body.data.User).toHaveProperty("password");
    
    } catch (err) {
      throw err;
    }
  });
  

  test("test menampilkan detail account by id -> error (not found)", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/accounts/${account[0].id * 100}`
      );
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

