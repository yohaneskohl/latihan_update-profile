const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let account;
let transaction;

describe("test POST /api/v1/transactions endpoint", () => {
  beforeAll(async () => {
    account = await prisma.bank_Accounts.findMany();
  });

  test("test create - membuat transaksi baru -> sukses(200)", async () => {
    try {
      let amount = 10000;
      let source_account_id = account[0].id;
      let destination_account_id = account[0].id;
      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ amount, source_account_id, destination_account_id });
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status", true);
      expect(body).toHaveProperty("message", "Data retrieved successfully");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("amount");
      expect(body.data).toHaveProperty("source_account_id");
      expect(body.data).toHaveProperty("destination_account_id");
      expect(body.data.amount).toBe(amount);
      expect(body.data.source_account_id).toBe(source_account_id);
      expect(body.data.destination_account_id).toBe(destination_account_id);
    } catch (err) {
      throw err;
    }
  });

  test("test create - Untuk pengirim atau penerima tidak valid -> error (404)", async () => {
    try {
      let amount = 5000; 
      let source_account_id = account[0].id * -1;
      let destination_account_id = account[0].id * -1;
      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ amount, source_account_id, destination_account_id });
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("test Saldo tidak mencukupi -> error (400)", async () => {
    try {
      let amount = 5000 * 5000; 
      let source_account_id = account[0].id;
      let destination_account_id = account[0].id;
      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ amount, source_account_id, destination_account_id });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

});

describe("test GET /api/v1/transactions endpoint", () => {
  test("test index - menampilkan semua transactions yang sudah terdaftar -> sukses(200)", async () => {
    try {
      let { statusCode, body } = await request(app).get("/api/v1/transactions");
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("amount");
      expect(body.data[0]).toHaveProperty("source_account_id");
      expect(body.data[0]).toHaveProperty("destination_account_id");
    } catch (err) {
      throw err;
    }
  });
});

describe("test GET /api/v1/transactions/:id endpoint", () => {
  beforeAll(async () => {
    transaction = await prisma.transaction.findMany();
  });
  test("show - test menampilkan detail transaction by id -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/transactions/${transaction[0].id}`
      );
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("amount");
      expect(body.data).toHaveProperty("source_account_id");
      expect(body.data).toHaveProperty("destination_account_id");
      expect(body.data).toHaveProperty("source_account");
      expect(body.data.source_account).toHaveProperty("id");
      expect(body.data.source_account).toHaveProperty("bank_name");
      expect(body.data.source_account).toHaveProperty("bank_account_number");
      expect(body.data.source_account).toHaveProperty("balance");
      expect(body.data.source_account).toHaveProperty("userId");
      expect(body.data).toHaveProperty("destination_account");
      expect(body.data.destination_account).toHaveProperty("id");
      expect(body.data.destination_account).toHaveProperty("bank_name");
      expect(body.data.destination_account).toHaveProperty("bank_account_number");
      expect(body.data.destination_account).toHaveProperty("balance");
      expect(body.data.destination_account).toHaveProperty("userId");
    } catch (err) {
      throw err;
    }
  });

  test("show - test Transaction not found -> error (404)", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/transactions/${transaction[0].id * 100}`
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
