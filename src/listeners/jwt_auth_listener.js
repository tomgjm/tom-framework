const require2 = require('tomjs/handlers/require2');
const system_cfg = require2('tomjs/configs')().system;
const BaseListener = require2('tomjs/listener/base_listener');
const log4js = require2('tomjs/handlers/log4js');
let appLog = console;
if (system_cfg.log4js_category) {
    appLog = log4js.getLogger(system_cfg.log4js_category);
}

class JWTAuthListener extends BaseListener {
    //函数名就是具体事件名称
    pass({ ctx, decodedToken, token } = {}) {
        appLog.info(new Date(), ":", "JWT Auth Pass", " IP:", ctx.ip, "originalUrl:", ctx.originalUrl, "decodedToken", decodedToken, "token", token);
    }
    revoked({ ctx, decodedToken, token } = {}) {
        appLog.info(new Date(), ":", "JWT Auth revoked", " IP:", ctx.ip, "originalUrl:", ctx.originalUrl, "decodedToken", decodedToken, "token", token);
    }
}
module.exports = JWTAuthListener;
