const express = require("express");
const bankController = require("../controller/bankController");
const { uploadSingle } = require("../middleware/multer");
const router = express.Router();

router.post("/create", uploadSingle, bankController.addBank);
router.get("/read",bankController.viewBank);
router.patch("/update/:id",uploadSingle, bankController.updateBank);
router.delete("/delete/:id",bankController.deleteBank);
module.exports = router;
