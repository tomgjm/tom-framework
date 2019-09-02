const { toBool } = require('tomjs/handlers/base_tools')
module.exports = {
    models: {
        UserModel: './models/user',
    },
    policies:{
        UserModel: './policies/user_policy',//此处是以src目录开始的文件名 
    },
    search: {
        enabled: true,
        paths:['./models/'],//搜索起始目录 可以数组 或 字符串以,分割
        type: -1,//-1:全部尝试,0:不变动,1:decamelize(foo_bar下划线分割),2:pascalize(HelloWorld 驼峰首字母大写),3:camelize(helloWorld 驼峰首字母小写)
        pluralize: -1,//-1全部,0:不变动,1:单数,2:复数形式
        end_add: ['','Model','_model'],//尝试添加后缀搜索 可以数组 或 字符串以,分割
    },
    pql:{
        all_in_data: true,//pql查询出的数据是否都装载在data属性中
        ctx_body_query_field: 'pql',
        ctx_body_pql_file_values_field: 'values',
        pql_path:(process.env.PQL_PATH || 'pql'),
        pql_public_path:(process.env.PQL_PUBLIC_PATH || 'pql/public'),
        only_pql_file_mode: toBool(process.env.ONLY_PQL_FILE) || false,
        options:{
            max_deep: 3,
            default_limit: 10,//默认限制deep返回记录数量，如果值为false就表示不限制，对于直接查询结果无效 对deep记录有效（就是对第一层记录无效）
            is_guard: false,
            _deepPopulate_values: '_deepPopulate_values',
            getValues: 'getValues',
            locals: {},
        },
        pivot:'$pivot',
    },
    pagination:{
        pagination_info:'pagination_info',//分页信息装载在pagination_info属性中
        ctx_field: 'query',//是读取ctx的query属性还是body属性
        pageindex: 'pageindex',
        pagesize: 'pagesize',
    },
    belongs_to_many:{
        _belongs_to_many_head:'_belongs_to_many_',
        _all_belongs_to_many_head:'_all_belongs_to_many_',
        pivot:'pivot',
    }
};
