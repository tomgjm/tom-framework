const require2 = require('tomjs/handlers/require2');
const auth_cfg = require2('tomjs/configs')().auth;
const BaseListener = require2('tomjs/listener/base_listener');
const log4js = require2('tomjs/handlers/log4js');
let Log = console;
if (typeof(auth_cfg.log4js_category) && (auth_cfg.log4js_category.length > 0)) {
    Log = log4js.getLogger(auth_cfg.log4js_category);
}

class UserListener extends BaseListener {
    //函数名就是具体事件名称
    register({ctx, user, token}={}) {
        Log.info(`user register ip: ${ctx.ip}, user id: ${user.id}`);
    }
    login_$({ctx, user, token}={}) {
        Log.info(`user login_$ ok ip: ${ctx.ip}, user id: ${user.id}`);
    }
    login_ok({ctx, user, token}={}) {
        Log.info(`user login ok ip: ${ctx.ip}, user id: ${user.id}`);
    }
    login_error({ctx, where}={}) {
        Log.error(`user login error ip: ${ctx.ip}, where:`, where);
    }
    login_by_id({ctx, user, token}={}) {
        Log.info(`user login by id ok ip: ${ctx.ip}, user id: ${user.id}`);
    }
    login_by_id_error({ctx, id}={}) {
        Log.error(`user login by id error ip: ${ctx.ip}, user id: ${id}`);
    }
    retoken({ctx, token_obj, token}={}) {
        Log.info(`user retoken ip: ${ctx.ip}, user id: ${token_obj.id}`);
    }
    logout({ctx, id}={}) {
        Log.info(`user logout ip: ${ctx.ip}, user id: ${id}`);
    }
    resetpassword({ctx,id}={}){
        Log.info(`resetpassword ok ip: ${ctx.ip}, user id: ${id}`);
    }
    resetpassword_error({ctx,id}={}){
        Log.error(`resetpassword error ip: ${ctx.ip}, user id: ${id}`);
    }
    forgotpassword({ctx,id}={}){
        Log.info(`forgotpassword ok ip: ${ctx.ip}, user id: ${id}`);
    }
    forgotpassword_error({ctx,where}={}){
        Log.error(`forgotpassword error ip: ${ctx.ip}, where:`,where);
    }
}
module.exports = UserListener;
