const express = require('express')
const Result = require('../models/Result')
const { login } = require('../services/user')
const { md5 } = require('../utils/index')
const { PWD_SALT } = require('../utils/constant')
const router = express.Router()

router.post('/login', function (req, res, next) {
  let { username, password } = req.body
  password = md5(username + PWD_SALT)

  login(username, password).then(user => {
    if (!user || user.length === 0) {
      new Result('登录失败').fail(res)
    } else {
      new Result('登录成功').success(res)
    }
  })

  // if (username === 'admin' && password === '123456') {
  //   new Result('登录成功').success(res)
  // } else {
  //   new Result('登录失败').fail(res)
  // }
})

module.exports = router