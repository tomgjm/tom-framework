const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();
const ApiError = require(path.join(AppDir, './error/api_error'));
const BaseController = require2('tomjs/controllers/base_controller');
const { getDBObjByID } = require2('tomjs/handlers/db_tools');
const {{ model_name }} = require(path.join(AppDir, './models/{{ file_name }}'));


module.exports = class {{ controller }}Controller extends BaseController {
    constructor(EventName) {
        super(EventName);
        this.{{ model_object }} = {{ model_name }}.Model();
    }

    async index(ctx) {
        //getValues可以传入一个对象，其属性名就是不要输出的属性内容
        ctx.body = (await this.{{ model_object }}.findAll(ctx.query).pql(ctx).paginate(ctx)).getValues();
    }

    async show(ctx, id) {
        //显示单项
        const {{ document }} = await getDBObjByID(this.{{ model_object }}, id, ctx);
        this.authorize(ctx, 'show', {{ document }});
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
            cr = await this.{{ model_object }}.create(ctx.request.body);
        } catch (e) {
            throw new ApiError(ApiError.DB_ERROR, { message: e.message });
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
        this.authorize(ctx, 'edit', {{ document }});
        const old_info = {{ document }}.toJSON();

        {{ document }}.assign(ctx.request.body);

        try {
            await {{ document }}.save();
            this.emitter.emit('edit', { ctx, id, old_info, new_info: {{ document }}.toJSON() });
        } catch (e) {
            throw new ApiError(ApiError.DB_ERROR, { id: id, message: ctx.request.body });
        }

        ctx.body = {{ document }};
    }

    async destroy(ctx, id) {
        //authorize权限检测 统一检测权限规范方便统一调整
        const {{ document }} = await getDBObjByID(this.{{ model_object }}, id);
        this.authorize(ctx, 'delete', {{ document }});
        const old_info = {{ document }}.toJSON();
        try {
            await {{ document }}.delete();
            this.emitter.emit('delete', { ctx, id, info: old_info });
        } catch (e) {
            throw new ApiError(ApiError.DB_ERROR, { id: id, message: ctx.request.body });
        }
        ctx.body = true;
    }
}
