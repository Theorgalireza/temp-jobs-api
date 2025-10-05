const express = require('express')
const { login, register } = require('../controllers/auth')
const routers = express.Router()

routers.route("/login").post(login)
routers.route("/register").post(register)

module.exports = routers