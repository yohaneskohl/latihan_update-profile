const router = require("express").Router();
const { createAccount, index, show } = require("../../controllers/v1/accountControllers");

router.post("/accounts", createAccount);
router.get("/accounts",index);
router.get("/accounts/:id", show);


module.exports = router;