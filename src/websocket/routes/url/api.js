const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const WsRouter = require2('tomjs/router/websocket-router');
const ratelimit = require2('tomjs/middleware/ratelimit');//访问限制器

let route = new WsRouter();
route.all('/', async function (ctx, next) {
    ctx.websocket.on_message = async function (data) {
        await ctx.websocket.send('on_message:' + JSON.stringify(data));
    };
    ctx.websocket.on('error', async (error) => {
        console.error(error);
        await ctx.websocket.error_send(error);
        ctx.websocket.terminate();
    });
    return next();
});

route.ws_router('/test/:id', 'api');
module.exports = route;
