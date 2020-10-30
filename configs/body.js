const path = require('path');
const { toBool } = require('tomjs/handlers/base_tools');
module.exports = {
    multipart: toBool(process.env.BODY_MULTIPART || true),
    //strict: toBool(process.env.BODY_STRICT || false),
    parsedMethods: process.env.BODY_PARSEDMETHODS || ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    formidable: {
        uploadDir: path.join(__dirname, '../', process.env.BODY_UPLOAD_DRI || 'public/uploads/tmp'),
        keepExtensions: toBool(process.env.BODY_UPLOAD_DRI || true), // 保持文件的后缀
        maxFieldsSize: process.env.BODY_MAXFIELDSSIZE || 2 * 1024 * 1024,
    },
    jsonLimit: process.env.BODY_JSONLIMIT || '10mb',
    formLimit: process.env.BODY_FORMLIMIT || '10mb',
    textLimit: process.env.BODY_TEXTLIMIT || '10mb',
    unless: (ctx) => { return false },
}