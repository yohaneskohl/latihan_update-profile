const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createAccount: async (req, res) => {
    let { bank_name, bank_account_number, balance, userId } = req.body;
    try {
        // Validasi input
        if (!bank_name || !bank_account_number || !userId) {
            return res.status(400).json({
                status: false,
                message: "All input fields are required",
                data: null,
            });
        }

        // Cek apakah pengguna ditemukan
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: `User with id ${userId} not found`,
                data: null,
            });
        }

        // Cek apakah nomor rekening bank sudah ada
        const existingAccount = await prisma.bank_Accounts.findFirst({
            where: { bank_account_number },
        });
        if (existingAccount !== null) {
            return res.status(401).json({
                status: false,
                message: "Bank account number already exists",
                data: null,
            });
        }

        // Buat akun baru
        const newAccount = await prisma.bank_Accounts.create({
            data: {
                bank_name,
                bank_account_number,
                balance,
                User: {
                    connect: {
                        id: userId,
                    },
                },
            },
            include: { User: true },
        });

        // Kirim respons sukses
        return res.status(200).json({
            status: true,
            message: "Account created successfully",
            data: newAccount,
        });
    } catch (error) {
        console.error("Error creating account:", error);
        // Kirim respons kesalahan internal server
        res.status(500).json({ error: "Internal server error" });
    }
},

  
  // Menampilkan daftar akun
  index: async (req, res) => {
    try {
      let accounts = await prisma.bank_Accounts.findMany({
        include: {
          User: true,
        },
      });
      return res.status(200).json({
        status: true,
        message: "Data retrieved successfully",
        data: accounts,
      });
    } catch (error) {
      console.error("Error creating account:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Menampilkan detail akun
  show: async (req, res) => {
    let account_id = parseInt(req.params.id);
    try {
      let account = await prisma.bank_Accounts.findUnique({
        where: { id: account_id },
        include: {
          User: true,
        },
      });
      if (!account) {
        return res.status(404).json({
          status: false,
          message: "Account not found",
          data: null,
        });
      }
      return res.status(200).json({
        // Jika pengguna ditemukan
        status: true,
        message: "Data retrieved successfully",
        data: account,
      });
    } catch (error) {
      console.error("Error creating account:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
