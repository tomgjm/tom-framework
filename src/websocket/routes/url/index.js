const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const Router = require2('koa-router');
const authorize = require2('tomjs/handlers/authorize');//数据库模型权限验证函数
const validator = require2('tomjs/handlers/validator');//表单验证 validator(ctx,'websocket/a@message',{});
const { login, retoken, decode_token, logout } = require2('tomjs/handlers/login_out');//提供用户登录，登出，生成新的token，解读token等功能
const ratelimit = require2('tomjs/middleware/ratelimit');//访问限制器

let route = new Router();
route.all('/', async function (ctx, next) {
    // the websocket is added to the context as `ctx.websocket`.
    ctx.websocket.on_error = (error) => {
        console.log('on_error', error);
    };
    ctx.websocket.on_message = async function (data) {
        await ratelimit('websocket').websocket(ctx);//进行访问限制
        //validator(ctx,'websocket/a@message',{});
        //authorize(ctx,'show',dbObject);
        await ctx.websocket.send('Hello:' + JSON.stringify(ctx.state));
        console.log("socket msessage:", data);
    };
    ctx.websocket.on('error', async (error) => {
        await ctx.websocket.error_send(error);
        ctx.websocket.terminate();
    });
    return next();
});

route.all('/test/:id', async function (ctx, next) {
    // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
    // the websocket is added to the context on `ctx.websocket`.
    ctx.websocket.on_error = (error) => {
        console.log('on_error', error);
    };
    ctx.websocket.on_message = async function (data) {
        // do something with the message from client
        await ratelimit('websocket').websocket(ctx);//进行访问限制
        await ctx.websocket.send('re2:' + JSON.stringify(data) + ' ' + JSON.stringify(ctx.state));
        console.log(data);
    };
    ctx.websocket.on('error', async (error) => {
        await ctx.websocket.error_send(error);
        ctx.websocket.terminate();
    });
    return next();
});
module.exports = route;
