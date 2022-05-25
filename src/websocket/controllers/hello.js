const require2 = require('tomjs/handlers/require2');
// const path = require2('path');
// const { isObject } = require2('tomjs/handlers/tools');
const BaseApiError = require2('tomjs/error/base_api_error');
const BaseController = require2('tomjs/controllers/base_controller');

module.exports = class HelloController extends BaseController {
    //显示列表
    async index(ctx) {
    }

    //显示单项
    async show(ctx, id) {
    }

    //显示新建页面
    async create(ctx) {
    }

    //保存新建数据
    async store(ctx) {
    }

    //显示编辑页面
    async edit(ctx, id) {
    }

    //保存编辑数据
    async update(ctx, id) {
    }

    //删除数据
    async destroy(ctx, id) {
    }

    async hello(ctx) {
        ctx.body = { receive: ctx.request.body };
        //await ctx.render('index', { title: 'my title', content: 'my content' });
        //ctx.websocket.broadcast({receive: ctx.request.body});
        //ctx.websocket.all_broadcast({msg:'websocket_server'});
        //ctx.websocket.joinRoom('temp');
        //ctx.body = await ctx.websocket.sendUsersAsync(['5c8a43891086bd7c9cff2105'], index + ",haha~");
        // ctx.body = await ctx.websocket.sendSocketsAsync([ctx.request.body.socket_id], index + ",haha~");
        //console.log(`broadcastRoom count:${count}`);

        // ctx.websocket.getRooms();//获得所有房间信息
        // ctx.websocket.createRoom(room_name, isAdmin = false)//新建房间
        // ctx.websocket.deleteRoom(room_name, force = false)//删除房间
        // ctx.websocket.changeRoomAdmin(room_name, new_ctx, force = false);//变更房间管理员
        // ctx.websocket.joinRoom(room_name, isAdmin = false);//加入房间
        // ctx.websocket.leaveRoom(room_name);//离开房间
        // ctx.websocket.forceLeaveRoom(ctx,room_name);//强制某用户离开房间
        // ctx.websocket.ws_server 提供 AllWSServers 对象实例
        // ctx.broadcastRoom();//房间内广播

        //示例向房间内用户进行广播
        // const rooms = ctx.websocket.getRooms()
        // rooms[room_name].users.forEach((client) => {
        //     if ((all || client.websocket !== socket) && client.websocket.readyState === WebSocket.OPEN) {
        //         client.websocket.send(ws_data);
        //         iCount++;
        //     }
        // });

        // ctx.websocket.sendSocket(socket_id, data);//指定socket_id发送消息
        // ctx.websocket.sendSocketAsync(socket_id, data);//指定socket_id发送消息
        // ctx.websocket.sendSockets(socket_ids, data);//指定socket_ids(数组)发送消息
        // ctx.websocket.sendSocketsAsync(socket_ids, data);//指定socket_ids(数组)发送消息
        // ctx.websocket.sendUser(user_id, data);//指定user_id发送消息
        // ctx.websocket.sendUserAsync(user_id, data);//指定user_id发送消息
        // ctx.websocket.sendUsers(user_ids, data);//指定user_ids(数组)发送消息
        // ctx.websocket.sendUsersAsync(user_ids, data);//指定user_ids(数组)发送消息
    }
}
