const require2 = require('tomjs/handlers/require2');
// const path = require2('path');
// const { isObject } = require2('tomjs/handlers/tools');
const BaseApiError = require2('tomjs/error/base_api_error');

let index = 0;
class co {
    //显示列表
    async index(ctx) {
    }

    //显示单项
    async show(ctx, id) {
    }

    //显示新建页面
    async create(ctx) {
    }

    //保存新建数据
    async store(ctx) {
    }

    //显示编辑页面
    async edit(ctx, id) {
    }

    //保存编辑数据
    async update(ctx, id) {
    }

    //删除数据
    async destroy(ctx, id) {
    }

    async hello(ctx) {
        index++;
        //ctx.body = { receive: ctx.request.body };
        //await ctx.render('index', { title: 'my title', content: 'my content' });
        //ctx.websocket.broadcast({receive: ctx.request.body});
        //ctx.websocket.all_broadcast({msg:'websocket_server'});
        //ctx.websocket.joinRoom('temp');
        //ctx.body = await ctx.websocket.sendUsersAsync(['5c8a43891086bd7c9cff2105'], index + ",haha~");
        ctx.body = await ctx.websocket.sendSocketsAsync([ctx.request.body.socket_id], index + ",haha~");
        //console.log(`broadcastRoom count:${count}`);
    }

}
module.exports = co
