const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const SystemConfig = require2('tomjs/configs')().system;
const authorize = require2('tomjs/handlers/authorize');//数据库模型权限验证函数
const validator = require2('tomjs/handlers/validator');//表单验证 validator(ctx,'websocket/a@message',{});
const { login, retoken, decode_token, logout } = require2('tomjs/handlers/login_out');//提供用户登录，登出，生成新的token，解读token等功能
const ratelimit = require2('tomjs/middleware/ratelimit');//访问限制器

module.exports = async function (server_ws, isWSS) {
    // server_ws.server.on('upgrade', function (request, socket, head) {
    //     console.log('upgrade '+(isWSS?'wss':'ws'));
    //     //此处可以做 链接websocket验证操作
    // });
    if (isWSS) {
        console.log('Now start wss on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_https_port + '...');
    }
    else {
        console.log('Now start ws on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_http_port + '...');
    }
};