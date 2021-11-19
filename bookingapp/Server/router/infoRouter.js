const express = require("express");
const infoController = require("../controller/infoController");
const {uploadSingle} = require("../middleware/multer");
const router = express.Router();
 

router.post("/create", uploadSingle, infoController.addInfo);
// router.get("/read", featureController.viewFeature);
// router.patch("/update/:id",uploadSingle, featureController.updateFeature);
// router.delete("/delete/:id",featureController.deleteFeature);
module.exports = router;
