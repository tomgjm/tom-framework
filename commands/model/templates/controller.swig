const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();
const ApiError = require(path.join(AppDir, './error/api_error'));
const BaseController = require2('tomjs/controllers/base_controller');
const { getDBObjByID } = require2('tomjs/handlers/db_tools');
const { filterCTXQuery, isObject } = require2('tomjs/handlers/tools');
const {{ model_name }} = require(path.join(AppDir, './models/{{ file_name }}'));


module.exports = class {{ controller }}Controller extends BaseController {
    constructor(EventName) {
        super(EventName);
        this.{{ model_object }} = {{ model_name }}.Model();
    }

    async index(ctx) {
        // getValues可以传入一个对象，其属性名就是不要输出的属性内容
        // if(!isObject(ctx.query)){ctx.query = {};}
        // if(ctx.auth.id()){
        //     ctx.query['$or'] = [{status: {{ model_name }}.defines.status.ok},{user_id: ctx.auth.id()}];
        // }
        // else{
        //     ctx.query.status = {{ model_name }}.defines.status.ok;
        // }
        ctx.body = (await this.{{ model_object }}.findAll(filterCTXQuery(ctx)).pql(ctx).paginate(ctx)).getValues();
    }

    async show(ctx, id) {
        //显示单项
        const {{ document }} = await getDBObjByID(this.{{ model_object }}, id, ctx);
        await this.authorize(ctx, 'show', {{ document }});
        ctx.body = {{ document }};
        this.emitter.emit('show', { ctx, id });
    }

    // async create(ctx) {
    //     //显示新建页面
    // }

    async store(ctx) {
        //保存新建数据
        let cr = undefined;
        try {
            // ctx.all_params.user_id = ctx.auth.id();
            cr = await this.{{ model_object }}.create(ctx.all_params);
        } catch (e) {
            throw new ApiError(ApiError.DB_ERROR, { all_params: ctx.all_params });
        }
        ctx.body = cr;
        this.emitter.emit('store', { ctx, info: cr.toJSON() });
    }

    // async edit(ctx, id) {
    //     //显示编辑页面
    // }

    async update(ctx, id) {
        //authorize权限检测 统一检测权限规范方便统一调整
        const {{ document }} = await getDBObjByID(this.{{ model_object }}, id);
        await this.authorize(ctx, 'edit', {{ document }});
        const old_info = {{ document }}.toJSON();

        // ctx.all_params.user_id = ctx.auth.id();
        {{ document }}.assign(ctx.all_params);

        try {
            await {{ document }}.save();
            this.emitter.emit('edit', { ctx, id, old_info, new_info: {{ document }}.toJSON() });
        } catch (e) {
            throw new ApiError(ApiError.DB_ERROR, { id: id, all_params: ctx.all_params });
        }

        ctx.body = {{ document }};
    }

    async destroy(ctx, id) {
        //authorize权限检测 统一检测权限规范方便统一调整
        const {{ document }} = await getDBObjByID(this.{{ model_object }}, id);
        await this.authorize(ctx, 'delete', {{ document }});
        const old_info = {{ document }}.toJSON();
        try {
            await {{ document }}.delete();
            this.emitter.emit('delete', { ctx, id, info: old_info });
        } catch (e) {
            throw new ApiError(ApiError.DB_ERROR, { id: id, all_params: ctx.all_params });
        }
        ctx.body = true;
    }
}
