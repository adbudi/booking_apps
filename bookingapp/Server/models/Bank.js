const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    trim: true,
    require: [true, "Please Input Bank Name!"]
  },

  accountNumber: {
    type: String,
    require: [true, "Please Input Account number"]
  },

  accountHolder: {
    type: String,
    require: [true, "Please Input Account Holder"]
  },

  imageUrl: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Bank", bankSchema);
