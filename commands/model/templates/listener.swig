const require2 = require('tomjs/handlers/require2');
const BaseListener = require2('tomjs/listener/base_listener');
const log4js = require2('tomjs/handlers/log4js');
const Log = log4js.getLogger("app");

module.exports = class {{ class_name }}Listener extends BaseListener {
    //函数名就是具体事件名称
    show({ ctx, id } = {}) {
        Log.info(`{{ class_name }}Listener.show ip: ${ctx.ip}, id: ${id}`);
    }
    store({ ctx, info } = {}) {
        Log.info(`{{ class_name }}Listener.store ip: ${ctx.ip}, info:`, info);
    }
    update({ ctx, id, old_info, new_info } = {}) {
        Log.info(`{{ class_name }}Listener.update ip: ${ctx.ip}, old_info:`, old_info, "new_info:", new_info);
    }
    destroy({ ctx, id, info } = {}) {
        Log.info(`{{ class_name }}Listener.destroy ip: ${ctx.ip}, id: ${id}, info:`, info);
    }
}
