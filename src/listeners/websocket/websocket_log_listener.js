const require2 = require('tomjs/handlers/require2');
const system_cfg = require2('tomjs/configs')().system;
const BaseListener = require2('tomjs/listener/base_listener');
const log4js = require2('tomjs/handlers/log4js');
const { getUserIDByCTX } = require2('tomjs/handlers/listener_tools');
let Log = console;
if (system_cfg.log4js_websocket_category) {
    Log = log4js.getLogger(system_cfg.log4js_websocket_category);
}

module.exports = class WebsocketLogListener extends BaseListener {
    //函数名就是具体事件名称
    error({ error, ctx } = {}) {
        let user_id = getUserIDByCTX(ctx);
        Log.error(`Websocket error ip: ${ctx.ip}, user id:${user_id}, error:`, error);
    }
    error_send({ error, ctx } = {}) {
        let user_id = getUserIDByCTX(ctx);
        Log.error(`Websocket error_send ip: ${ctx.ip}, user id:${user_id}, error:`, error);
    }
    error_not_send({ error, ctx } = {}) {
        let user_id = getUserIDByCTX(ctx);
        Log.error(`Websocket error_not_send ip: ${ctx.ip}, user id:${user_id}, error:`, error);
    }

    error_add_max_socket({ ctx, socket_id } = {}) {
        let user_id = getUserIDByCTX(ctx);
        Log.info(`Websocket add_max_socket ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id}`);
    }

    error_add_one_user_max({ ctx, user_id, count } = {}) {
        let socket_id = ctx.websocket.getID();
        Log.info(`Websocket add_one_user_max ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id}, user socket count:${count}`);
    }

    error_add_max_users({ ctx, user_id, count } = {}) {
        let socket_id = ctx.websocket.getID();
        Log.info(`Websocket add_max_users ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id}, user socket count:${count}`);
    }

    error_receive_reply({ error, ctx } = {}) {
        let user_id = getUserIDByCTX(ctx);
        Log.error(`Websocket error_receive_reply error ip: ${ctx.ip}, user id:${user_id}, error:`, error);
    }

    add_socket({ ctx, socket_id } = {}) {
        let user_id = getUserIDByCTX(ctx);
        Log.info(`Websocket add_socket ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id}`);
    }

    delete_socket_before_sync({ ctx, socket_id, user_id } = {}) {
        Log.info(`Websocket delete_socket_before_sync  ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id}`);
    }
    delete_socket({ ctx, socket_id, user_id } = {}) {
        Log.info(`Websocket delete_socket ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id}`);
    }

    add_user({ ctx, user_id, count } = {}) {
        let socket_id = ctx.websocket.getID();
        Log.info(`Websocket add_user ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id}, user socket count:${count}`);
    }
    
    delete_user_before_sync({ ctx, user_id, count } = {}) {
        let socket_id = ctx.websocket.getID();
        Log.info(`Websocket delete_user_before_sync ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id} user socket count:${count}`);
    }

    delete_user({ ctx, user_id, count } = {}) {
        let socket_id = ctx.websocket.getID();
        Log.info(`Websocket delete_user ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id} user socket count:${count}`);
    }

    create_room({ ctx, room_name } = {}) {
        if (ctx) {
            let user_id = getUserIDByCTX(ctx);
            Log.info(`Websocket user create_room: ${room_name}, ip: ${ctx.ip}, user id:${user_id}`);
        }
        else {
            Log.info(`Websocket system create_room: ${room_name}`);
        }
    }

    delete_room_before_sync({ ctx, room_name, force, auto } = {}) {
        if (ctx) {
            let sAuto = auto ? 'auto_' : 'user ';
            let user_id = getUserIDByCTX(ctx);
            Log.info(`Websocket ${sAuto}delete_room_before_sync: ${room_name}, ip: ${ctx.ip}, user id:${user_id}`);
        }
        else {
            let sAuto = auto ? 'auto_' : '';
            Log.info(`Websocket system ${sAuto}delete_room_before_sync: ${room_name}`);
        }
    }

    delete_room({ ctx, room_name, force, auto } = {}) {
        if (ctx) {
            let sAuto = auto ? 'auto_' : 'user ';
            let user_id = getUserIDByCTX(ctx);
            Log.info(`Websocket ${sAuto}delete_room: ${room_name}, ip: ${ctx.ip}, user id:${user_id}`);
        }
        else {
            let sAuto = auto ? 'auto_' : '';
            Log.info(`Websocket system ${sAuto}delete_room: ${room_name}`);
        }
    }

    change_room_admin_before_sync({ ctx, room_name, new_ctx } = {}) {
        let user_id = undefined;
        let ip = undefined;
        let new_user_id = undefined;
        let new_ip = undefined;
        if (ctx) {
            ip = ctx.ip;
            user_id = getUserIDByCTX(ctx);
        }
        if (new_ctx) {
            new_ip = ctx.ip;
            new_user_id = getUserIDByCTX(new_ctx);
        }
        Log.info(`Websocket change_room_admin_before_sync: ${room_name}, old user id:${user_id}, ip: ${ip},change to new user id:${new_user_id}, ip: ${new_ip}`);
    }

    change_room_admin({ ctx, room_name, new_ctx } = {}) {
        let user_id = undefined;
        let ip = undefined;
        let new_user_id = undefined;
        let new_ip = undefined;
        if (ctx) {
            ip = ctx.ip;
            user_id = getUserIDByCTX(ctx);
        }
        if (new_ctx) {
            new_ip = ctx.ip;
            new_user_id = getUserIDByCTX(new_ctx);
        }
        Log.info(`Websocket change_room_admin: ${room_name}, old user id:${user_id}, ip: ${ip},change to new user id:${new_user_id}, ip: ${new_ip}`);
    }

    join_room({ ctx, room_name } = {}) {
        let user_id = getUserIDByCTX(ctx);
        let socket_id = ctx.websocket.getID();
        Log.info(`Websocket join_room room: ${room_name}, ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id}`);
    }

    leave_room_before_sync({ ctx, room_name } = {}) {
        let user_id = getUserIDByCTX(ctx);
        let socket_id = ctx.websocket.getID();
        Log.info(`Websocket leave_room_before_sync room: ${room_name}, ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id}`);
    }

    leave_room({ ctx, room_name } = {}) {
        let user_id = getUserIDByCTX(ctx);
        let socket_id = ctx.websocket.getID();
        Log.info(`Websocket leave_room room: ${room_name}, ip: ${ctx.ip}, user id:${user_id}, socket id: ${socket_id}`);
    }
}
