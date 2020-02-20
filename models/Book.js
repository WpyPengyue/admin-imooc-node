const { MIME_TYPE_EPUB, UPLOAD_URL, UPLOAD_PATH } = require('../utils/constant')
const fs = require('fs')
const Epub = require('../utils/epub')

class Book {

  constructor(file, data) {
    if (file) {
      this.createBookFromFile(file)
    } else if (data) {
      this.createBookFromData(data)
    }
  }

  createBookFromFile(file){
    // console.log('createBookFromFile', file)
    const {
      destination: des, // 文件本地存储目录
      filename, // 文件名称
      mimetype = MIME_TYPE_EPUB // 文件资源类型
    } = file
    const suffix = mimetype === MIME_TYPE_EPUB ? '.epub' : ''
    const oldBookPath = `${des}/${filename}`
    const bookPath = `${des}/${filename}${suffix}`
    const url = `${UPLOAD_URL}/book/${filename}${suffix}`
    const unzipPath = `${UPLOAD_PATH}/unzip/${filename}`
    const unzipUrl = `${UPLOAD_URL}/unzip/${filename}`
    if (!fs.existsSync(unzipPath)) {
      fs.mkdirSync(unzipPath, { recursive: true }) // 创建电子书解压后的目录
    }
    if (fs.existsSync(oldBookPath) && !fs.existsSync(bookPath)) {
      fs.renameSync(oldBookPath, bookPath) // 重命名文件
    }
    this.fileName = filename // 文件名
    this.path = `/book/${filename}${suffix}` // epub文件路径
    this.filePath = this.path // epub文件路径
    this.url = url // epub文件url
    this.title = '' // 标题
    this.author = '' // 作者
    this.publisher = '' // 出版社
    this.contents = [] // 目录
    this.cover = '' // 封面图片URL
    this.coverPath = '' // 封面图片路径
    this.category = -1 // 分类ID
    this.categoryText = '' // 分类名称
    this.language = '' // 语种
    this.unzipPath = `/unzip/${filename}` // 解压后的电子书目录
    this.unzipUrl = unzipUrl // 解压后的电子书链接
    this.originalName = file.originalname
  }

  createBookFromData(data){
    // console.log('createBookFromData', data)
  }

  parse() {
    return new Promise((resolve, reject) => {
      const bookPath = `${UPLOAD_PATH}${this.path}`
      console.log('bookpath:', bookPath)
      if (!this.path || !fs.existsSync(bookPath)) {
        reject(new Error('电子书路径不存在'))
      }
      const epub = new Epub(bookPath)
      epub.on('error', err => {
        console.log('epub on err')
        reject(err)
      })
      epub.on('end', err => {
        console.log('epub on err2')
        if (err) {
          reject(err)
        } else {
          console.log('manifest = ', epub.metadata)
          const {
            language,
            creator,
            creatorFileAs,
            title,
            cover,
            publisher
          } =  epub.metadata;
          if(!title){
            reject(new Error('图书标题为空'))
          }else{
            this.title = title
            this.language = language || 'en'
            this.author = creator || creatorFileAs || 'unknown'
            this.publisher = publisher || 'unknown'
            this.rootFile = epub.rootFile
            const handleGetImage = (err, file, mimetype) => {
              if(err){
                reject(err)
              }else{
                const suffix = mimetype.split('/')[1]
                const coverPath = `${UPLOAD_PATH}/img/${this.fileName}.${suffix}`
                const coverUrl = `${UPLOAD_URL}/img/${this.fileName}.${suffix}`
                fs.writeFileSync(coverPath, file, 'binary')
                this.coverPath = '/img/${this.fileName}.${suffix}'
                this.cover = coverUrl
                resolve(this)
              }
              console.log('err', err)
              console.log('file', file)
              console.log('mimetype', mimetype)
            }
            epub.getImage(cover, handleGetImage)
          }
        }
      })
      epub.parse()
      this.epub = epub
    })
  }

}

module.exports = Book