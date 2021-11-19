const express = require("express");
const categoryController = require("../controller/categoryController");
const router = express.Router();
router.post("/create", categoryController.addCategory);
router.get("/read", categoryController.viewCategory);
router.patch("/update/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);
module.exports = router;
