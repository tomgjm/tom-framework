const require2 = require('tomjs/handlers/require2');
const system_cfg = require2('tomjs/configs')().system;
const BaseListener = require2('tomjs/listener/base_listener');
const log4js = require2('tomjs/handlers/log4js');
const { getUserIDByCTX } = require2('tomjs/handlers/listener_tools');
let Log = console;
if (typeof (system_cfg.log4js_error_category) && (system_cfg.log4js_error_category.length > 0)) {
    Log = log4js.getLogger(system_cfg.log4js_error_category);
}

class WebsocketListener extends BaseListener {
    //函数名就是具体事件名称
    error({ error, ctx } = {}) {
        let user_id = getUserIDByCTX(ctx);
        Log.error(`Websocket error ip: ${ctx.ip}, user id:${user_id}, error:`,error);
    }
    error_send({ error, ctx } = {}) {
        let user_id = getUserIDByCTX(ctx);
        Log.error(`Websocket error ip: ${ctx.ip}, user id:${user_id}, error:`,error);
    }
}
module.exports = WebsocketListener;
