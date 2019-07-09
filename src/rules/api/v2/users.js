const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();
const ApiError = require(path.join(AppDir, './error/api_error'));

let aa = { name: 'aa haha2' };

exports.index = async(ctx) => {
    //显示列表
    ctx.body = {
        result: 'index2',
        path: ctx.request.path,
        name: ctx.params.id,
        para: ctx.query,
        m: aa
    }
}

exports.show = async(ctx, id) => {
    //显示单项
    if (ctx.params.id != 1) {
        throw new ApiError(ApiError.DB_ERROR, { id: ctx.params.id });
    }
    ctx.body = {
        result: 'show2',
        path: ctx.request.path,
        name: ctx.params.id,
        para: ctx.query,
        id: id
    }
}

exports.create = async(ctx) => {
    //显示新建页面
    ctx.body = {
        result: 'create2',
        path: ctx.request.path,
        name: ctx.params.id,
        para: ctx.query
    }
}

exports.store = async(ctx) => {
    //保存新建数据
    ctx.body = {
        result: 'store2',
        path: ctx.request.path,
        name: ctx.params.id,
        para: ctx.query
    }
}

exports.edit = async(ctx, id) => {
    //显示编辑页面
    ctx.body = {
        result: 'edit2',
        path: ctx.request.path,
        name: ctx.params.id,
        para: ctx.query,
        id: id
    }
}

exports.update = async(ctx, id) => {
    //保存编辑数据
    ctx.body = {
        result: 'update2',
        path: ctx.request.path,
        name: ctx.params.id,
        para: ctx.query,
        id: id
    }
}

exports.destroy = async(ctx, id) => {
    //删除数据
    ctx.body = {
        result: 'destroy2',
        path: ctx.request.path,
        name: ctx.params.id,
        para: ctx.query,
        id: id
    }
}