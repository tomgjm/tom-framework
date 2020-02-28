const require2 = require('tomjs/handlers/require2');
const email_cfg = require2('tomjs/configs')().email;
const BaseListener = require2('tomjs/listener/base_listener');
const log4js = require2('tomjs/handlers/log4js');
let emailLog = console;
if (email_cfg.log4js_category) {
    emailLog = log4js.getLogger(email_cfg.log4js_category);
}

class SendEMailEndListener extends BaseListener {
    //函数名就是具体事件名称
    sent({receivers, view_name, res}={}) {
        emailLog.info(`Sent EMail: ${receivers},view name: ${view_name}, res:`, res);
    }
    error({receivers, view_name, error}={}) {
        emailLog.error(`Send EMail: ${receivers},view name: ${view_name}, Error:`, error);
    }
}
module.exports = SendEMailEndListener;