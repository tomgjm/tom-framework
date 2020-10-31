const { toBool } = require('tomjs/handlers/base_tools')
module.exports = {
    models: {
        UserModel: './models/user',
    },
    defaultHidden: {
        _id: false,
        __v: false
    },
    mongoose_set: {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
    },
    policies: {
        UserModel: './policies/user_policy',//此处是以src目录开始的文件名 
    },
    search: {
        enabled: true,
        paths: ['./models/'],//搜索起始目录 可以数组 或 字符串以,分割
        type: -1,//-1:全部尝试,0:不变动,1:decamelize(foo_bar下划线分割),2:pascalize(HelloWorld 驼峰首字母大写),3:camelize(helloWorld 驼峰首字母小写)
        pluralize: -1,//-1全部,0:不变动,1:单数,2:复数形式
        end_add: ['', 'Model', '_model'],//尝试添加后缀搜索 可以数组 或 字符串以,分割
    },
    pql: {
        all_in_data: true,//pql查询出的数据是否都装载在data属性中
        ctx_body_query_field: 'pql',
        ctx_body_pql_file_values_field: 'values',
        pql_path: (process.env.PQL_PATH || 'pql'),
        pql_public_path: (process.env.PQL_PUBLIC_PATH || 'pql/public'),
        only_pql_file_mode: toBool(process.env.ONLY_PQL_FILE || false),
        options: {
            max_deep: 3,
            default_limit: 10,//默认限制deep返回记录数量，如果值为false就表示不限制，对于直接查询结果无效 对deep记录有效（就是对第一层记录无效）
            is_guard: false,// 此项为true 那么 $match 就会失效（pqlfile文件不受其影响），此项为false 那么 $match 就会生效（但第一层$match还是会失效，其只对填充项内$match 生效）要完全生成就要将 is_pql_file 设置为 true
            _deepPopulate_values: '_deepPopulate_values',
            getValues: 'getValues',
            locals: {},
            aggregate_id: 'id',
        },
        pivot: '$pivot',
    },
    pagination: {
        pagination_info: 'pagination_info',//分页信息装载在pagination_info属性中
        ctx_field: 'query',//是读取ctx的query属性还是body属性
        pageindex: 'pageindex',
        pagesize: 'pagesize',
        pagesize_default: 10,
        pagesize_min: 1,
        pagesize_max: 100,
    },
    belongs_to_many: {
        _belongs_to_many_head: '_belongs_to_many_',
        _all_belongs_to_many_head: '_all_belongs_to_many_',
        pivot: 'pivot',
    }
};
