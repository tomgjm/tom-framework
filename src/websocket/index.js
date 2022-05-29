const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const SystemConfig = require2('tomjs/configs')().system;
const authorize = require2('tomjs/handlers/authorize');//数据库模型权限验证函数
const validator = require2('tomjs/handlers/validator');//表单验证 validator(ctx,'websocket/a@message',{});
const { login, retoken, decode_token, logout } = require2('tomjs/handlers/login_out');//提供用户登录，登出，生成新的token，解读token等功能
const ratelimit = require2('tomjs/middleware/ratelimit');//访问限制器

const opt = require2('tomjs/auth/router_jwt_opt');
const jwt = require('jsonwebtoken');

const URL = require('url');

module.exports = async function (server_ws, isWSS) {
    // configs/websocket.js 中的 on_add_socket_fn 会优先于upgrade执行，下面代码意义不大
    // server_ws.server.on('upgrade', function (request, socket, head) {
    //     //此处可以做 链接websocket验证操作
    //     socket.pause();//要先暂停socket工作等待jwt验证
    //     request.upgrade = false;
    //     const params = URL.parse(request.url, true);
    //     const parts = params.query.Authorization.split(' ');
    //     if (parts.length === 2) {
    //         const scheme = parts[0];
    //         const credentials = parts[1];
    //         if (/^Bearer$/i.test(scheme)) {
    //             try {
    //                 jwt.verify(credentials, opt.secret,opt);
    //                 request.upgrade = true;
    //                 socket.resume();//继续socket工作
    //             }
    //             catch (error) {
    //                 request.upgrade = false;
    //                 socket.destroySoon();
    //             }
    //         }
    //     }
    // });
    if (isWSS) {
        console.log('Now start wss on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_https_port + '...');
    }
    else {
        console.log('Now start ws on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_http_port + '...');
    }
};