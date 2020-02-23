const { toBool } = require('tomjs/handlers/base_tools');
module.exports = {
    websocket_send_time_out: process.env.WEBSOCKET_SEND_TIME_OUT || 0,//单位毫秒
    websocket_id_head: process.env.WEBSOCKET_ID_HEAD || 's',
    auto_delete_empty_room: toBool(process.env.WEBSOCKET_AUTO_DELETE_EMPTY_ROOM || true),
    create_room_auto_join: toBool(process.env.WEBSOCKET_CREATE_ROOM_AUTO_JOIN || true),
}