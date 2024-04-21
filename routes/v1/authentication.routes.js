const router = require("express").Router();
const { register, verify, whoami } = require("../../controllers/v1/authenticationControllers");
const restrict = require("../../middlewares/auth.middlewares");

router.post("/authentication/register", register);
router.post("/authentication/verify", verify);
router.get("/authentication/whoami", restrict, whoami);

module.exports = router;