const { toBool } = require('tomjs/handlers/tools');
module.exports = {
    log4js_category : process.env.EMAIL_LOG_CATEGORY ||"email",
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST || 'localhost', //主机地址
    port: process.env.MAIL_PORT || 25, //端口
    secure: toBool(process.env.MAIL_SECURE || false),
    auth: {
        user: process.env.MAIL_USERNAME || '',
        pass: process.env.MAIL_PASSWORD || '',
    },
    sender_address: process.env.MAIL_SENDER_ADDRESS || '',
    tls: {
        rejectUnauthorized: toBool(process.env.MAIL_REJECTUNAUTHORIZED || false),
    },
};