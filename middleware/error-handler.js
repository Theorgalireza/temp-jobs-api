const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || "Something went wrong try again late"
  }


  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if(error.name === "ValidationError"){
    customError.msg = Object.values(err.errors).map((item)=>{
      return item.message
    }).join(",")
    customError.statusCode = 400
  }
  if(err.code && err.code === 11000){
    customError.msg = `Duplicate Value Entered for ${Object.keys(err.keyValue)} Field, Please Choose another Value.`
    customError.statusCode = 400
  }
  if(err.name === "CastError"){
    customError.msg = `No Item Found With ID: ${err.value}`
    customError.statusCode = 404
  }
  return res.status(customError.statusCode).json({ msg:customError.msg })
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware
