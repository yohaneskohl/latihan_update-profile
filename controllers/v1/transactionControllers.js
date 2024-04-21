const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  // Mengirimkan uang dari satu akun ke akun lainnya
  create: async (req, res) => {
    try {
      const { source_account_id, destination_account_id, amount } = req.body;

      const sourceAccount = await prisma.bank_Accounts.findUnique({
        where: { id: source_account_id },
      });

      const destinationAccount = await prisma.bank_Accounts.findUnique({
        where: { id: destination_account_id },
      });

      if (!sourceAccount || !destinationAccount) {
        return res.status(404).json({
          status: false,
          message: "Untuk pengirim atau penerima tidak valid",
          data: null
        });
      }

      if (sourceAccount.balance < amount) {
        return res.status(400).json({
          status: false,
          message: "Saldo tidak mencukupi",
          data: null
        });
      }

      const transferTransaction = await prisma.transaction.create({
        data: {
          amount,
          source_account: {
            connect: {
              id: source_account_id,
            },
          },
          destination_account: {
            connect: {
              id: destination_account_id,
            },
          },
        },
      });

      await prisma.bank_Accounts.update({
        where: { id: source_account_id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await prisma.bank_Accounts.update({
        where: { id: destination_account_id },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
        res.status(200).json({
          status: true,
          message: "Data retrieved successfully",
          data: transferTransaction,
        });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Menampilkan daftar transaksi
  index: async (req, res) => {
    try {
      const transaction = await prisma.transaction.findMany({});

      return res.status(200).json({
        status: true,
        message: "Data retrieved successfully",
        data: transaction,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },

  // Menampilkan detail transaksi
  show: async (req, res) => {
    const transactionId = parseInt(req.params.id);
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          source_account: true,
          destination_account: true,
        },
      });
      if (!transaction) {
        return res.status(404).json({ 
          status: true,
          message: "Transaction not found",
          data: null,
         });
      }
      res.status(200).json({
        status: true,
        message: "Data retrieved successfully",
        data: transaction,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
