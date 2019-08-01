const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const SystemConfig = require2('tomjs/configs')().system;
const route = require2('koa-route');
const authorize = require2('tomjs/handlers/authorize');//数据库模型权限验证函数
const validator = require2('tomjs/handlers/validator');//表单验证 validator(ctx,'websocket/a@message',{});
const ratelimit = require2('tomjs/middleware/ratelimit');//访问限制器

module.exports = async function (ws, isWSS) {
    ws.use(async function (ctx, next) {
        // the websocket is added to the context as `ctx.websocket`.
        ctx.websocket.on_error = (error) => {
            console.log('on_error', error);
        };
        ctx.websocket.on_message = async function (data) {
            await ratelimit('websocket').websocket(ctx);//进行访问限制
            //validator(ctx,'websocket/a@message',{});
            //authorize(ctx,'show',dbObject);
            await ctx.ws_send('Hello:' + JSON.stringify(ctx.state));
            console.log("socket msessage:", data);
        };
        ctx.websocket.on('error', async (error) => {
            await ctx.ws_error_send(error);
            ctx.websocket.terminate();
        });
        return next();
    });
    ws.use(route.all('/test/:id', async function (ctx, next) {
        // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
        // the websocket is added to the context on `ctx.websocket`.
        ctx.websocket.on_error = (error) => {
            console.log('on_error', error);
        };
        ctx.websocket.on_message = async function (data) {
            // do something with the message from client
            await ratelimit('websocket').websocket(ctx);//进行访问限制
            await ctx.ws_send('re2:' + JSON.stringify(data) + ' ' + JSON.stringify(ctx.state));
            console.log(data);
        };
        ctx.websocket.on('error', async (error) => {
            await ctx.ws_error_send(error);
            ctx.websocket.terminate();
        });
        return next();
    }));

    if (isWSS) {
        console.log('Now start wss on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_https_port + '...');
    }
    else {
        console.log('Now start ws on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_http_port + '...');
    }
};