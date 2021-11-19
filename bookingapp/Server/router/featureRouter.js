const express = require("express");
const featureController = require("../controller/featureController");
const { uploadSingle } = require("../middleware/multer");
const router = express.Router();
 

router.post("/create", uploadSingle, featureController.addFeature);
router.get("/read", featureController.viewFeature);
router.patch("/update/:id",uploadSingle, featureController.updateFeature);
router.delete("/delete/:id",featureController.deleteFeature);
module.exports = router;
