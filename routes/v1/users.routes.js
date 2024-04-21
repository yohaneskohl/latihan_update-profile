const router = require("express").Router();
const {register, index, show } = require("../../controllers/v1/userControllers");

router.post("/users", register);
router.get("/users", index);
router.get("/users/:id", show);

module.exports = router;