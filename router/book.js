const express = require('express')
const multer = require('multer')
const { UPLOAD_PATH, MIME_TYPE_EPUB } = require('../utils/constant')
const Result = require('../models/Result')
const Book = require('../models/Book')
const boom = require('boom')
const { decode } = require('../utils')
const bookService = require('../services/book')

const router = express.Router()

router.post(
  '/upload',
  multer({dest: `${UPLOAD_PATH}/book`}).single('file'),
  function (req, res, next) {
    if(!req.file || req.file.length === 0){
      new Result('上传电子书失败').fail(res)
    }else{
      const book = new Book(req.file)
      book.parse()
        .then(book => {
          console.log('book', book)
          new Result(book, '上传电子书成功').success(res)
        }).catch(err => {
          // console.log(err)
          next(boom.badImplementation(err))
        })
    }
  }
)

router.post(
  '/create',
  function (req, res, next) {
    const decodeObj = decode(req)
    // console.log(decodeObj)
    if(decodeObj && decodeObj.username) {
      req.body.username = decodeObj.username
    }
    console.log('body', req.body)
    const book = new Book(null, req.body)
    console.log('book', book)
    bookService.insertBook(book).then(() => {
      new Result('添加电子书成功').success(res)
    }).catch(err => {
      next(boom.badImplementation(err))
    })
  }
)

module.exports = router