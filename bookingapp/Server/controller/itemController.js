const Item = require("../models/Item");
const Category = require("../models/Category");
const Image = require("../models/Image");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  addItem: async (req, res) => {
    try {
      console.log(req.body);
      const { itemName, itemPrice, unit, location, description, category } =
        req.body;

      if (req.files) {
        const categoryDb = await Category.findOne({ _id: category });
        const newItem = new Item({
          category, //category ID
          itemName,
          itemPrice,
          unit,
          location,
          description,
        });

        const item = await Item.create(newItem);
        categoryDb.item.push({ _id: item._id });
        await categoryDb.save();

        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.image.push({ _id: imageSave._id });
          await item.save();
        }
        res.status(201).json(item);
      } else {
        return res.status(400).json({ message: "Image Not Found" });
      }
    } catch (err) {
      for (let i = 0; i < req.files.length; i++) {
        await fs.unlink(path.join(`public/images/${req.files[i].filename}`));
      }
      res.status(500).send(err.message);
    }
  },
  viewItem: async (req, res) => {
    try {
      const item = await Item.find()
        .populate({ path: "category", select: "id categoryName" })
        .populate({ path: "image", select: "id imageUrl" });
      item.length === 0
        ? res.status(404).json({ message: "No Data Item Found" })
        : res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateItem: async (req, res) => {
    console.log(req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "itemName",
      "itemPrice",
      "unit",
      "location",
      "description",
      "category",
      "isPopular",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(403).json({ message: "Wrong Key Parameter" });
    }
    try {
      const item = await Item.findById(req.params.id)
        .populate({
          path: "category",
          select: "id categoryName",
        })
        .populate({
          path: "image",
          select: "id imageUrl",
        });

      updates.forEach((update) => {
        item[update] = req.body[update];
      });
      await item.save();
      res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;

      const item = await Item.findOne({ _id: id });

      if (!item) {
        return res.status(404).send({ message: "Item Not Found" });
      }

      const categoryDb = await Category.findOne({ _id: item.category });

      async function deleteCategory() {
        for (let i = 0; i < categoryDb.item.length; i++) {
          if (categoryDb.item[i]._id.toString() === item._id.toString()) {
            categoryDb.item.pull({ _id: item._id });
            await categoryDb.save();
          }
        }
      }
      function deleteImage() {
        for (let i = 0; i < categoryDb.item.length; i++) {
          Image.findOne({ _id: item.image[i]._id })
            .then((image) => {
              fs.unlink(path.join(`public/${image.imageUrl}`));
              image.remove();
            })
            .catch((error) => {
              res.status(500).send({ message: err.message });
            });
        }
      }
      await item
        .remove()
        .then(() => deleteCategory())
        .then(() => deleteImage());
      res.status(200).json({ message: "Item Deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
