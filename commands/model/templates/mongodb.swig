const require2 = require('tomjs/handlers/require2');
const model = require2('tomjs/models/mongoose_model');
// const middleware = require('./middleware/user');
const validate = require('./validate');
const { toObject } = require('tomjs/handlers/base_tools')
const configs = require2('tomjs/configs')();
const database_cfg = configs.database;

class {{ model_name }} extends model {
    Init() {
        //this.collection = '{{ collection_name }}'

        // this.fillable = ['name',];//如果有设置那么create函数中这些字段会被填充
        this.guarded = ['_id', 'created_at', 'updated_at', 'deleted', 'deleted_at',];//不会被在create中被填充字段

        this.Schema = {
{{fields_str}}
        };

        // mongodb 读写等级
        this.SchemaOption = Object.assign({}, toObject(database_cfg.mongodb_schema_options) ||
        {
            readConcern: {
                level: 'majority',
            },
            writeConcern: {
                w: 'majority',
                j: true,
                wtimeout: 1000,
            }
        });

        // 字段枚举定义
        // this.defines = {
        //     field_name: {
        //         lock: 0,
        //         ok: 1,
        //     },
        // };

        this.timestamps();
        // this.softDeletes();//开启支持软删除
{{fields_ref_str}}
    }
    modelAfter(modelObj) {
        //console.log('modelAfter');
    }
}
const obj = new {{ model_name }};
// new middleware(obj.BuildSchema); //引入中间件
// obj.BuildSchema.index({ 字段A: 1, 字段B: 1, }, { unique: true });//联合索引
module.exports = obj;