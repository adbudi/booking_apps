const express = require("express");
const infoController = require("../controller/infoController");
const {uploadSingle} = require("../middleware/multer");
const router = express.Router();
 

router.post("/create", uploadSingle, infoController.addInfo);
router.get("/read", infoController.viewInfo);
router.patch("/update/:id",uploadSingle, infoController.updateInfo);
// router.delete("/delete/:id",featureController.deleteFeature);
module.exports = router;
