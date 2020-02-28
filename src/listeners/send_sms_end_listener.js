const require2 = require('tomjs/handlers/require2');
const sms_cfg = require2('tomjs/configs')().sms;
const BaseListener = require2('tomjs/listener/base_listener');
const log4js = require2('tomjs/handlers/log4js');
let smsLog = console;
if (sms_cfg.log4js_category) {
    smsLog = log4js.getLogger(sms_cfg.log4js_category);
}


//sent 事件 参数: info { 'gateway': gateway, 'nationCode': nationCode, 'phoneNumber': phoneNumber, 'error': undefined, 'res': res }
//error 事件 参数: info = { 'gateway': gateway, 'nationCode': nationCode, 'phoneNumber': phoneNumber, 'error': err }
//error_all 事件 参数: re_arr
//error_gateways 事件 参数: gateways

class SendSMSEndListener extends BaseListener {
    //函数名就是具体事件名称
    sent(info) {
        smsLog.info(`Send SMS OK`, info);
    }
    error(info) {
        smsLog.error(`Send SMS error`, info);
    }
    error_all(re_arr) {
        smsLog.error(`Send SMS all gateways error`, re_arr);
    }
    error_gateways(gateways) {
        smsLog.error(`SMS gateways error`, gateways);
    }    
}
module.exports = SendSMSEndListener;