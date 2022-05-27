const { toBool } = require('tomjs/handlers/base_tools');
module.exports = {
    websocket_max_connect: process.env.WEBSOCKET_MAX_CONNECT || 0,//服务器最多发websocket连接数量 0为不限制 优先于 on_add_socket_fn 执行判断
    websocket_send_time_out: process.env.WEBSOCKET_SEND_TIME_OUT || 0,//单位毫秒
    websocket_id_head: process.env.WEBSOCKET_ID_HEAD || 's',
    auto_delete_empty_room: toBool(process.env.WEBSOCKET_AUTO_DELETE_EMPTY_ROOM || true),
    create_room_auto_join: toBool(process.env.WEBSOCKET_CREATE_ROOM_AUTO_JOIN || true),
    user_max_connect: process.env.WEBSOCKET_USER_MAX_CONNECT || 1,//一个用户最多发起几个websocket连接数量 0为不限制 晚于 on_add_user_socket_fn 执行判断

    on_add_socket_fn: null, //返回false就会断开连接, 参数 socket, id(socket的id,如果已经在all_sockets中，可以通过ID做下标找到), all_sockets（现有所有的socket）
    on_delete_socket_fn: null, //忽略返回结果 参数 socket, id(socket的id,如果已经在all_sockets中，可以通过ID做下标找到), all_sockets（现有所有的socket）

    on_add_user_socket_fn: null, //返回false就会断开连接, 参数 ctx, socket, user_id(socket 的 user_id ,如果已经在 all_auth_users 中，可以通过user_id做下标找到), all_auth_users （现有所有的socket）
    on_delete_user_socket_fn: null, //忽略返回结果 参数 ctx, socket, user_id(socket 的 user_id ,如果已经在 all_auth_users 中，可以通过ID做下标找到), all_auth_users （现有所有的socket）
}