const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const Router = require2('koa-router');
const BaseApiError = require2('tomjs/error/base_api_error');
const authorize = require2('tomjs/handlers/authorize');//数据库模型权限验证函数
const validator = require2('tomjs/handlers/validator');//表单验证 validator(ctx,'websocket/a@message',{});
const { login, retoken, decode_token, logout } = require2('tomjs/handlers/login_out');//提供用户登录，登出，生成新的token，解读token等功能
const ratelimit = require2('tomjs/middleware/ratelimit');//访问限制器


let route = new Router();
route.use('/', ratelimit('websocket').websocket);
route.all('/', async function (ctx, next) {
    //validator(ctx,'websocket/a@message',{});
    //authorize(ctx,'show',dbObject);
    //await ctx.websocket.send('Hello:' + JSON.stringify(ctx.websocket.message));
    ctx.body = { server_msg: 'Hello:' + JSON.stringify(ctx.request.body) };
    console.log("socket msessage:", ctx.websocket.message);
    return next();
});
route.all('/test/:id', async function (ctx, next) {
    //validator(ctx,'websocket/a@message',{});
    //authorize(ctx,'show',dbObject);
    await ctx.websocket.send('Hello:' + JSON.stringify(ctx.websocket.message));
    console.log("socket msessage:", ctx.websocket.message);
    return next();
});

module.exports = route;
