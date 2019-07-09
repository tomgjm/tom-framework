const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();
const ApiError = require(path.join(AppDir, './error/api_error'));
//const { verify, getToken, decode } = require2('tomjs/handlers/jwt-sign');
const Password = require2('tomjs/password');
const BaseUser = require2('tomjs/controllers/base_user');
const { isObject } = require2('tomjs/handlers/tools');
class co extends BaseUser {
    constructor() {
        super();
    }
    async index(ctx) {
        //显示列表
        //throw new ApiError(ApiError.DB_NOT_FOUND, { message: 'test message' });
        let MainRoutes = require('../../../routes/main-routes');
        ctx.body = {
            result: 'index',
            path: ctx.request.path,
            name: ctx.params.id,
            para: ctx.query,
            m: MainRoutes.url('users.show', 3),
        }
        console.log('index');
    }

    async show(ctx, id) {
        //显示单项
        let cr = undefined;
        try { cr = await this.users.findById(id); } catch (e) {
            throw new ApiError(ApiError.DB_NOT_FOUND, { id: id, message: e.message });
        }
        if (cr == null) {
            throw new ApiError(ApiError.DB_NOT_FOUND, { id: id });
        }
        this.authorize(ctx,'show',cr);
        //let token = getToken(ctx) //获取头部提交过来的token原文
        //let verify_obj = await verify(token) //验证并解析出token中内容，示例一下
        //let decode_obj = decode(token) //不验证直接解析出token中内容，示例一下
        ctx.body = {
            user: ctx.state.user, //获取验证后的token信息
            //token: token,
            //verify: verify_obj,
            //decode: decode_obj,
        }
    }

    async create(ctx) {
        //显示新建页面
        ctx.body = {
            result: 'create',
            path: ctx.request.path,
            name: ctx.params.id,
            para: ctx.query,
        }

    }

    async store(ctx) {
        //保存新建数据
        let cr = undefined;
        try {
            cr = await this.users.create({
                name: ctx.request.body.name,
                password: await Password.hash(ctx.request.body.password)
            });
        } catch (e) {
            throw new ApiError(ApiError.DB_ERROR, { message: e.message });
        }
        ctx.body = {
            result: 'store',
            path: ctx.request.path,
            name: ctx.params.id,
            para: ctx.query,
            cr: cr,
        }
    }

    async edit(ctx, id) {
        //显示编辑页面
        ctx.body = {
            result: 'edit',
            path: ctx.request.path,
            name: ctx.params.id,
            para: ctx.query,
            id: id
        }
    }

    async update(ctx, id) {
        //保存编辑数据
        if(isObject(ctx.request.files)&&isObject(ctx.request.files.image))
        {
            let url = path.relative(path.resolve(AppDir,'../'), ctx.request.files.image.path);
            //console.log(url);            
        }

        ctx.body = {
            result: 'update',
            path: ctx.request.path,
            name: ctx.params.id,
            para: ctx.query,
            id: id
        }
    }

    async destroy(ctx, id) {
        //删除数据
        ctx.body = {
            result: 'destroy',
            path: ctx.request.path,
            name: ctx.params.id,
            para: ctx.query,
            id: id
        }
    }

}
module.exports = co
