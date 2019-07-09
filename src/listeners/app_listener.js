const require2 = require('tomjs/handlers/require2');
const system_cfg = require2('tomjs/configs')().system;
const BaseListener = require2('tomjs/listener/base_listener');
const log4js = require2('tomjs/handlers/log4js');
let appLog = console;
if (typeof (system_cfg.log4js_category) && (system_cfg.log4js_category.length > 0)) {
    appLog = log4js.getLogger(system_cfg.log4js_category);
}

class AppListener extends BaseListener {
    //函数名就是具体事件名称
    error({ ctx, error } = {}) {
        appLog.info(new Date(), ":", error, " IP:", ctx.ip);
    }
}
module.exports = AppListener;
