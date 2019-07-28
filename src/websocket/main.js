const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const route = require2('koa-route');

module.exports = async function initWebSocket(ws) {
    ws.use(function (ctx, next) {
        // the websocket is added to the context as `ctx.websocket`.
        ctx.websocket.on('message', function (message) {
            ctx.websocket.send('Hello World');
            console.log("socket msessage:", message);
        });
    });
    ws.use(route.all('/test/:id', function (ctx, next) {
        // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
        // the websocket is added to the context on `ctx.websocket`.
        ctx.websocket.send('Hello World');
        ctx.websocket.on('message', function (message) {
            // do something with the message from client
            console.log(message);
        });
    }));
};