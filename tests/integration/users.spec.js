const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let token = "";
let user = {};


describe("test POST /api/v1/users endpoint", () => {

  beforeAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.bank_Accounts.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });

  test("test register berhasil -> sukses", async () => {
    try {
      let name = "user1234";
      let email = "user1234@gmail.com";
      let password = "password123";
      let identity_type = "KTP";
      let identity_number = "00001";
      let address = "address1";
      let { statusCode, body } = await request(app)
        .post("/api/v1/users")
        .send({ name, email, password, identity_type, identity_number, address });
        
      user = body.data;
      // let Profile = [];

      console.log("body : ", body);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");

      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data).toHaveProperty("Profile");

      expect(body.data.Profile[0]).toHaveProperty("id");
      expect(body.data.Profile[0]).toHaveProperty("address");
      expect(body.data.Profile[0]).toHaveProperty("identity_number");
      expect(body.data.Profile[0]).toHaveProperty("identity_type");
      expect(body.data.Profile[0]).toHaveProperty("userId");
  
      expect(body.data.name).toBe(name);
      expect(body.data.email).toBe(email);
      expect(body.data.password).toBe(password);
      
      expect(body.data.Profile[0].address).toBe(address);
      expect(body.data.Profile[0].identity_number).toBe(identity_number);
      expect(body.data.Profile[0].identity_type).toBe(identity_type);
      
    } catch (err) {
      throw err;
    }
  });

  test("test Email sudah digunakan! -> error(404)", async () => {
    try {
      let name = "user1234";
      let email = "user1234@gmail.com";
      let password = "password123";
      let identity_type = "KTP";
      let identity_number = "00001";
      let address = "address1";
      let { statusCode, body } = await request(app)
        .post("/api/v1/users")
        .send({ name, email, password, identity_type, identity_number, address });

      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });

  test("test Semua data harus diisi! -> error(400)", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/users")
        .send({});
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

// describe("test POST /api/v1/auth/login endpoint", () => {
//   test("test login user -> sukses", async () => {
//     try {
//       let email = "user1234@gmail.com";
//       let password = "password123";
//       let { statusCode, body } = await request(app)
//         .post("/api/v1/authentication/verify")
//         .send({ email, password });

//       token = body.data.token;
//       console.log("token:", token);
//       expect(statusCode).toBe(200);
//       expect(body).toHaveProperty("status");
//       expect(body).toHaveProperty("message");
//       expect(body).toHaveProperty("data");
//       expect(body.data).toHaveProperty("id");
//       expect(body.data).toHaveProperty("name");
//       expect(body.data).toHaveProperty("email");
//       expect(body.data).toHaveProperty("token");
//     } catch (err) {
//       throw err;
//     }
//   });

//   test("test inputan ada yang tidak diisi -> error", async () => {
//     try {
//       let email = "";
//       let password = "";
//       let { statusCode, body } = await request(app)
//         .post("/api/v1/authentication/verify")
//         .send({email, password});

//       expect(statusCode).toBe(400);
//       expect(body).toHaveProperty("status");
//       expect(body).toHaveProperty("message");
//       expect(body).toHaveProperty("data");
//     } catch (err) {
//       throw err;
//     }
//   });
// });

describe("test GET /api/v1/users endpoint", () => {
  test("test menampilkan semua users yang sudah terdaftar -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app)
        .get("/api/v1/users")
        
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("name");
      expect(body.data[0]).toHaveProperty("email");
      expect(body.data[0]).toHaveProperty("password");
    } catch (err) {
      throw err;
    }
  });
});

describe("test GET /api/v1/users/:id endpoint", () => {
  test("test menampilkan detail users by id -> sukses", async () => {
    
    try {
      let { statusCode, body } = await request(app)
        .get(`/api/v1/users/${user.id}`)
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data).toHaveProperty("Profile");
      expect(body.data.Profile[0]).toHaveProperty("id");
      expect(body.data.Profile[0]).toHaveProperty("identity_type");
      expect(body.data.Profile[0]).toHaveProperty("identity_number");
      expect(body.data.Profile[0]).toHaveProperty("address");
      expect(body.data.Profile[0]).toHaveProperty("userId");
    } catch (err) {
      throw err;
    }
  });

  test("test menampilkan detail users by id -> error", async () => {
    try {
      let { statusCode, body } = await request(app)
        .get(`/api/v1/users/-1`)
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});
