const User = require("../models/User");
const BadRequestError = require("../errors/bad-request");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  //   const { name, email, passsword } = req.body;
  //   if(!name || !email || !passsword){
  //     throw new BadRequestError("Please Provide Name, Email and Password.")
  //   }
  //   const salt = await bcrypt.genSalt(10)
  //   const hashedPassword = await bcrypt.hash(password,salt)

  //   const tempUser = {name,email,password:hashedPassword}

  const user = await User.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({ user:{name:user.getName()}, token:user.createJWT() });
};

const login = async (req, res) => {
  const {email,password} = req.body
  const user = await User.findOne({email})
  if(!user){
    throw new BadRequestError("User doesn't exist")
  }
  // const isPasswordCorrect = await bcrypt.compare(password, user.password)
  const isPasswordCorrect = await user.comparePassword(password)
  if(isPasswordCorrect==true){
    
    return res.status(StatusCodes.OK).json({user:{name:user.getName()},token:user.createJWT()})
  }
  else{
    throw new BadRequestError("Email or Password is not valid")
  }
  
};

module.exports = { register, login };
