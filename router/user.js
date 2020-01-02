const express = require('express')
const Result = require('../models/Result')

const router = express.Router()

router.post('/login', function(req, res, next) {
  const username = req.body.username
  const password = req.body.password

  if (username === 'admin' && password === '123456') {
    new Result('登录成功').success(res)
  } else {
    new Result('登录失败').fail(res)
  }
})

module.exports = router