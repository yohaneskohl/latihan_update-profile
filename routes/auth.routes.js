const router = require("express").Router();
const { register } = require("../controllers/auth.controllers");
// const restrict = require("../../middlewares/auth.middlewares");

router.post("/aut/register", register);


module.exports = router;