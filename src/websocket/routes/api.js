const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const WsRouter = require2('tomjs/router/ws-url-router');
//const ratelimit = require2('tomjs/middleware/ratelimit');//访问限制器
const router_jwt = require2('tomjs/auth/router_jwt');

let route = new WsRouter();

route.path('/', 'api');

//route.use('/test/:id',router_jwt()); 开启jwt验证
route.path('/test/:id', async function (ctx, next) {
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
module.exports = route;
