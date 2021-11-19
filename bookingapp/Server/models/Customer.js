const mongoose = require("mongoose");
const validatore = require("validator");
const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "Please Input First Name"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Please Input lAST Name"],
  },
  email: {
    type: String,
    required: [true, "Please Input Email"],
    trim:true,
    lowercase:true,
    validate(value){
        if(!validatore.isEmail(value)){
            throw Error ("Please Provide a valid Email Address")
        }
    }
  },
  phoneNumber: {
    type: String,
    required: [true,"Please Input Phone Number"]
  },
})
module.exports = mongoose.model("Customer", customerSchema);
