const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const route = require2('koa-route');
const authorize = require2('tomjs/handlers/authorize');//数据库模型权限验证函数
const validator = require2('tomjs/handlers/validator');//表单验证 validator(ctx,'websocket/a@message',{});
const ratelimit = require2('tomjs/middleware/ratelimit');//访问限制器

module.exports = async function initWebSocket(ws) {
    //ws.use(ratelimit('websocket_all').websocket);//全局访问限制
    ws.use(function (ctx, next) {
        // the websocket is added to the context as `ctx.websocket`.
        ctx.websocket.on('message', async function (message) {
            try {
                await ratelimit('websocket').websocket(ctx);//进行访问限制
                //validator(ctx,'websocket/a@message',{});
                //authorize(ctx,'show',cr);
                await ctx.ws_send('Hello World');
                console.log("socket msessage:", message);
            } catch (error) {
                console.error(error);
                ctx.ws_error_send(error);
            }
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