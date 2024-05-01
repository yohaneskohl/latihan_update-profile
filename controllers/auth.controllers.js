const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    register: async (req, res, next) => {
        try {
          let { first_name, last_name, email, password, } =
            req.body;
    
          if (!first_name || !last_name || !email || !password) {
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
              first_name,
              last_name,
              email,
              password,
              
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
    
};