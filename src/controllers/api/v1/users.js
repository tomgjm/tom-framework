const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();
const ApiError = require(path.join(AppDir, './error/api_error'));
const UsersHandler = require(path.join(AppDir, './handlers/users_handler'));
const Password = require2('tomjs/password');
const BaseUser = require2('tomjs/controllers/base_user');
const { isObject } = require2('tomjs/handlers/base_tools');
const { getDBObjByID } = require2('tomjs/handlers/db_tools');
class co extends BaseUser {
    constructor() {
        super();
    }
    async index(ctx) {
        //显示列表
        //throw new ApiError(ApiError.DB_NOT_FOUND, { message: 'test message' });
        let MainRoutes = require2('tomjs/router/main-router');
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
        let user = await getDBObjByID(this.users, id);
        this.authorize(ctx, 'show', user);
        //let token = getToken(ctx) //获取头部提交过来的token原文
        //let verify_obj = await verify(token) //验证并解析出token中内容，示例一下
        //let decode_obj = decode(token) //不验证直接解析出token中内容，示例一下
        ctx.body = user;
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
        //authorize权限检测 统一检测权限规范方便统一调整
        let user = await getDBObjByID(this.users, id);
        this.authorize(ctx, 'edit', user);
        let old_info = user.toJSON();

        //保存编辑数据
        if (isObject(ctx.request.files) && isObject(ctx.request.files.image)) {
            ctx.request.body.avatar = [await UsersHandler.avatar(id, ctx.request.files.avatar.path)];
            //console.log(url);            
        }
        user.assign(ctx.request.body);

        try {
            await user.save();
            this.emitter.emit('update', { user_id: id, old_info, new_info: user.toJSON() });
        } catch (e) {
            throw new ApiError(BaseApiError.DB_ERROR, { id: id, message: ctx.request.body });
        }

        ctx.body = user;
    }

    async destroy(ctx, id) {
        //删除数据
        let user = await getDBObjByID(this.users, id);
        this.authorize(ctx, 'delete', user);
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
