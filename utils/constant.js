const {env} = require('./env')

const UPLOAD_PATH = env === 'dev' ? '/Users/wangpengyue/Documents/upload/ebook':'';

module.exports = {
    CODE_ERROR: -1,
    CODE_SUCCESS: 0,
    CODE_TOKEN_EXPIRED: -2,
    debug: true,
    PWD_SALT: 'admin_imooc_node',
    PRIVATE_KEY: 'wangpengyue_private_key',
    JWT_EXPIRED: 60 * 60, // token失效时间
    UPLOAD_PATH: UPLOAD_PATH
}