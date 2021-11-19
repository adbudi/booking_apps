const Item = require("../models/Item");
const Info = require("../models/Info");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  addInfo: async (req, res) => {
    // console.log(req.body);
    const { infoName, type, isHighlight, description, item } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image Info Not Found" });
    }

    try {
      const info = await Info.create({
        infoName,
        type,
        isHighlight,
        description,
        item,
        imageUrl: `images/${req.file.filename}`,
      });
        // console.log(info._id)
      const itemDb = await Item.findOne({ _id: item });
      
      console.log(itemDb.info)
      // if(itemDb.info !== null){
      //   itemDb.info.push({ _id : info._id });
      // }else{
       

      // }
      // itemDb.info.push({ _id : info._id });
      //  await itemDb.save();

      res.status(201).json(info);
    } catch (err) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`));
      res.status(400).json({ message: err.message });
    }
  },
};
