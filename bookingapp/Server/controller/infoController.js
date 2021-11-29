const Item = require('../models/Item')
const Info = require('../models/Info')
const fs = require('fs-extra')
const path = require('path')

module.exports = {
  addInfo: async (req, res) => {
    console.log(req.body)
    const { infoName, type, isHighlight, description, item } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Image Info Not Found' })
    }

    try {
      const info = await Info.create({
        infoName,
        type,
        isHighlight,
        description,
        item,
        imageUrl: `images/${req.file.filename}`,
      })
      // console.log(info._id)
      const itemDb = await Item.findOne({ _id: item })

      //console.log(itemDb.info);
      //if(itemDb.info !== null){
      // itemDb.info.push({ _id : info._id });
      // }else{

      //}
      itemDb.info.push({ _id: info._id })
      await itemDb.save()

      res.status(201).json(info)
    } catch (err) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`))
      res.status(400).json({ message: err.message })
    }
  },
  viewInfo: async (req, res) => {
    try {
      const info = await Info.find().populate({
        path: 'item',
        select: 'id itemName',
      })
      info.length === 0
        ? res.status(404).json({ message: 'No Data Info Found' })
        : res.status(200).json(info)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  },
  updateInfo: async (req, res) => {
    console.log(req.body)

    const id = req.params.id

    const updates = Object.keys(req.body)
    const allowedUpdates = [
      'infoName',
      'type',
      'isHighlight',
      'description',
      'item',
    ]
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update),
    )
    if (!isValidOperation) {
      return res.status(403).json({ message: 'Wrong Key Parameter' })
    }
    try {
      const info = await Info.findById({ _id: id })
      if (req.file == undefined) {
        updates.forEach((update) => {
          info[update] = req.body[update]
        })
        await info.save()
        res.status(200).json(info)
      } else {
        const info = await Info.findById(req.params.id)
        await fs.unlink(path.join(`public/${info.imageUrl}`))
        updates.forEach((update) => {
          info[update] = req.body[update]
        })
        info.imageUrl = `images/${req.file.filename}`
        await info.save()
        res.status(200).json(info)
      }
    } catch (err) {
      if (req.file) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`))
      }
      res.status(500).send(err.message)
    }
  },
  deleteInfo: async (req, res) => {
    try {
      const id = req.params.id

      const info = await Info.findOne({ _id: id })

      if (!info) {
        return res.status(404).send({ message: 'Info Not Found' })
      }

      async function deleteItem() {
        const itemDb = await Item.findOne({ _id: info.item })

        for (let i = 0; i < itemDb.info.length; i++) {
          if (itemDb.info[i]._id.toString() === info._id.toString()) {
            itemDb.info.pull({ _id: info._id })
            await itemDb.save()
          }
        }
      }

      await info
        .remove()
        .then(() => deleteItem())
        .then(() => fs.unlink(path.join(`public/${info.imageUrl}`)))
      res.status(200).json({ message: 'Info Deleted' })
    } catch (err) {
      res.status(500).send(err.message)
    }
  },
}
