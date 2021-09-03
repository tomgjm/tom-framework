const require2 = require('tomjs/handlers/require2');
const BaseListener = require2('tomjs/listener/base_listener');
const { getClassFuncName } = require2('tomjs/handlers/base_tools');
const log4js = require2('tomjs/handlers/log4js');
const Log = log4js.getLogger("app");

module.exports = class {{ class_name }}Listener extends BaseListener {
    //函数名就是具体事件名称
    show({ ctx, id } = {}) {
        const fn_name = getClassFuncName();
        try{
            Log.info(`{{ fn_name }} ip: ${ctx.ip}, id: ${id}`);
        }
        catch(error){
            Log.error(fn_name, error);
        }
    }
    store({ ctx, info } = {}) {
        const fn_name = getClassFuncName();
        try{
            Log.info(`{{ fn_name }} ip: ${ctx.ip}, info:`, info);
        }
        catch(error){
            Log.error(fn_name, error);
        }
    }
    edit({ ctx, id, old_info, new_info } = {}) {
        const fn_name = getClassFuncName();
        try{
            Log.info(`{{ fn_name }} ip: ${ctx.ip}, id: ${id}, old_info:`, old_info, "new_info:", new_info);
        }
        catch(error){
            Log.error(fn_name, error);
        }
    }
    delete({ ctx, id, info } = {}) {
        const fn_name = getClassFuncName();
        try{
            Log.info(`{{ fn_name }} ip: ${ctx.ip}, id: ${id}, info:`, info);
        }
        catch(error){
            Log.error(fn_name, error);
        }
    }
}
