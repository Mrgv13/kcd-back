const db = require('../db')
const apiError = require('../error/api.error')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models')

const generateJwt = (id, email) => {
  return jwt.sign(
    {id, email},
    process.env.JWT_ACCESS_SECRET,
    {expiresIn:"24h"})
}

class UserController{

  async registration(req, res, next) {
  const {email, password} = req.body

    const candidate = await User.findOne({where: {email}})

    if (candidate) {
      return next(apiError.badRequest("email error"))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({email, password: hashPassword})
    const token = generateJwt(user.id, user.email)
    return res.json({token})

  }

  async login(req, res, next) {
    const {email, password} = req.body
    const user = await User.findOne({where: {email}})
    if (!user){
        return next(apiError.internal('user not found'))
    }

    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword){
      return next(apiError.internal('error in login or password'))
    }

    const token = generateJwt(user.id, user.email,)
    return res.json({token})
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email)

    return  res.json({token})


  }
}

module.exports = new UserController()
