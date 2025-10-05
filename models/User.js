const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Username"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please Provide a Email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please Provide a Valid Email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
    minlength:6
  },
});



UserSchema.pre('save',async function(){  //mongoose hook middleware before saviong data in database
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)
  
})
UserSchema.methods.getName = function (){
    return this.name
}
UserSchema.methods.createJWT = function (){
      const token = jwt.sign(
        { userId: this._id, name: this.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
      );
      return token
}
UserSchema.methods.comparePassword =async  function(password){
    const isPasswordCorrect =await bcrypt.compare(password, this.password)
    return isPasswordCorrect
}
module.exports = mongoose.model("User",UserSchema)
