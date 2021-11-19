const express = require("express");
const itemController = require("../controller/itemController");
const { uploadMultiple } = require("../middleware/multer");
const router = express.Router();

router.post("/create", uploadMultiple, itemController.addItem);
router.get("/read",itemController.viewItem);
router.patch("/update/:id", itemController.updateItem);
router.delete("/delete/:id",itemController.deleteItem);
module.exports = router;
