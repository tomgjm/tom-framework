const require2 = require('tomjs/handlers/require2');
const Events = require2('tomjs/handlers/events');
const queue = require2('tomjs/handlers/queue')('sms_send');
const sms_cfg = require2('tomjs/configs')().sms;
const BaseListener = require2('tomjs/listener/base_listener');
const { SendSMS } = require2('tomjs/sms');
const log4js = require2('tomjs/handlers/log4js');
let smsLog = console;
if (sms_cfg.log4js_category) {
    smsLog = log4js.getLogger(sms_cfg.log4js_category);
}

class SendSMSListener extends BaseListener {
    //函数名就是具体事件名称
    send({ phoneNumber, templateId, params, mobile_gateways } = {}) {
        emitter = Events.getEventEmitter('send_sms_end');
        queue.add(() => {
            SendSMS(phoneNumber, templateId, params, mobile_gateways)
                .then(function (res) {
                    emitter.emit('sent', { phoneNumber, templateId, params, res });
                })
                .catch(function (error) {
                    emitter.emit('error', { phoneNumber, templateId, params, error });
                });
        });
        smsLog.info(`Sending SMS in queue phoneNumber:${phoneNumber}, templateId:${templateId}, params:`, params, ",mobile_gateways:", mobile_gateways);
    }
}
module.exports = SendSMSListener;