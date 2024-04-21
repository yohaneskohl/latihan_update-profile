const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  register: async (req, res, next) => {
    try {
      let { name, email, password, identity_type, identity_number, address } =
        req.body;

      if (!name || !email || !password || !identity_type || !identity_number || !address) {
        return res.status(400).json({
          status: false,
          message: "Semua data harus diisi!",
          data: null
        });
      }

      let exist = await prisma.user.findFirst({ where: { email: email } });
      if (exist) {
        return res.status(404).json({
          status: false,
          message: "Email sudah digunakan!",
          data: null
        });
      }

      let user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          Profile: {
            create: { identity_type, identity_number, address },
          },
        },
        include: {
          Profile: true,
        },
      });

      res.status(200).json({
        status: true,
        message: "User data created successfully!",
        data: user,
      });
    } catch (error) {
      next(error); 
    }
  },

  index: async (req, res, next) => {
    try {
      let { search } = req.query;

      let users = await prisma.user.findMany({
        where: { name: { contains: search } },
        include: { Profile: true },
      });

      res.status(200).json({
        status: true,
        message: "Data retrieved successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { Profile: true },
      });
  
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User tidak ditemukan",
          data: null,
        });
      }
  
      res.status(200).json({
        status: true,
        message: "User details retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  
};
