const require2 = require('tomjs/handlers/require2');
const EMail = require2('tomjs/handlers/email');
const Events = require2('tomjs/handlers/events');
const email_cfg = require2('tomjs/configs')().email;
const BaseListener = require2('tomjs/listener/base_listener');
const log4js = require2('tomjs/handlers/log4js');
let emailLog = console;
if (typeof (email_cfg.log4js_category) && (email_cfg.log4js_category.length > 0)) {
    emailLog = log4js.getLogger(email_cfg.log4js_category);
}

class SendEMailListener extends BaseListener {
    //函数名就是具体事件名称
    send({ receivers, view_name, locals } = {}) {
        let emitter = Events.getEventEmitter('send_email_end');
        EMail(receivers, view_name, locals)
            .then(function (res) {
                emitter.emit('sent', { receivers, view_name, res });
            })
            .catch(function (error) {
                emitter.emit('error', { receivers, view_name, error });
            });
        emailLog.info(`Sending EMail: ${receivers},view name: ${view_name}, locals:`, locals);
    }
}
module.exports = SendEMailListener;