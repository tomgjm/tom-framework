const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const SystemConfig = require2('tomjs/configs')().system;
const initWebSocket = require('./main.js');

module.exports = async function (app_ws, app_wss) {
    if (app_ws) {
        await initWebSocket(app_ws.ws);
        console.log('Now start ws on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_http_port + '...');
    }
    if (app_wss) {
        await initWebSocket(app_wss.ws);
        console.log('Now start wss on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_https_port + '...');
    }
}