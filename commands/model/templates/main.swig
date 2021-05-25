const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const database = require2('tomjs/database'); //根据配置连接数据库
const type = database.getType();
module.exports = require(path.join(__dirname, type, '{{ file_name }}'));