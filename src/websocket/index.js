const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const route = require2('koa-route');
const SystemConfig = require2('tomjs/configs')().system;

function initWebSocket(app) {
    app.ws.use(function (ctx) {
        // the websocket is added to the context as `ctx.websocket`.
        ctx.websocket.on('message', function (message) {
            ctx.websocket.send('Hello World');
            console.log("socket msessage:", message);
        });
    });
    app.ws.use(route.all('/test/:id', function (ctx) {
        // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
        // the websocket is added to the context on `ctx.websocket`.
        ctx.websocket.send('Hello World');
        ctx.websocket.on('message', function (message) {
            // do something with the message from client
            console.log(message);
        });
    }));
}

module.exports = async function (app_ws, app_wss) {
    if (app_ws) {
        initWebSocket(app_ws);
        console.log('Now start ws on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_http_port + '...');
    }
    if (app_wss) {
        initWebSocket(app_wss);
        console.log('Now start wss on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_https_port + '...');
    }
}