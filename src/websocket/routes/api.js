const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const WsRouter = require2('tomjs/router/ws-url-router');
//const ratelimit = require2('tomjs/middleware/ratelimit');//访问限制器
const router_jwt = require2('tomjs/auth/router_jwt');

let route = new WsRouter();

route.use(router_jwt(true));//设置全局都要检验jwt 并是的之后ctx.auth可用(这个身份检验是在websocket刚刚连接后根据URL进行分配子路由的时候校验)
route.path('/', 'api');

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
