const router = require("express").Router();
const { create, index, show } = require("../../controllers/v1/transactionControllers");


router.post("/transactions", create);
router.get("/transactions", index);
router.get("/transactions/:id", show);


module.exports = router;