const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();
const ApiError = require(path.join(AppDir, './error/api_error'));
const UsersHandler = require(path.join(AppDir, './handlers/users_handler'));
// const Password = require2('tomjs/password');
const BaseUser = require2('tomjs/controllers/base_user');
const { filterCTXQuery, isObject } = require2('tomjs/handlers/tools');
const { getDBObjByID } = require2('tomjs/handlers/db_tools');
const auth_cfg = require2('tomjs/configs')().auth;
const UserModel = require2(auth_cfg.auth_model);

class User extends BaseUser {

    constructor(EventName) {
        super(EventName);
        this.users = UserModel.Model();
    }

    async index(ctx) {
        //显示列表
        ctx.body = (await this.users.findAll(filterCTXQuery(ctx)).pql(ctx).paginate(ctx)).getValues();
    }

    async show(ctx, id) {
        //显示单项
        const user = await getDBObjByID(this.users, id);
        await this.authorize(ctx, 'show', user);
        ctx.body = user;
        this.emitter.emit('show', { ctx, id });
    }

    async update(ctx, id) {
        //authorize权限检测 统一检测权限规范方便统一调整
        let user = await getDBObjByID(this.users, id);
        await this.authorize(ctx, 'edit', user);
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
            throw new ApiError(BaseApiError.DB_ERROR, e.message, { id: id, all_params: ctx.all_params });
        }

        ctx.body = user;
    }

    // async destroy(ctx, id) {
    //     //删除数据
    //     let user = await getDBObjByID(this.users, id);
    //     this.authorize(ctx, 'delete', user);
    //     ctx.body = {
    //         result: 'destroy',
    //         path: ctx.request.path,
    //         name: ctx.params.id,
    //         para: ctx.query,
    //         id: id
    //     }
    // }

}
module.exports = User
