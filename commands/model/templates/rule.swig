// const require2 = require('tomjs/handlers/require2');
// const path = require2('path');
// const AppDir = require2('tomjs/handlers/dir')();

module.exports = class {{ class_name }}Rules {

    constructor() {
    }

    async store(ctx) {
        //保存新建数据
        return {
            rules: {
{{rule_str}}
            },
            attributes: {
{{rule_attributes_str}}
            }
        }
    }

    async update(ctx) {
        //保存更新数据
        return {
            rules: {
{{rule_str}}
            },
            attributes: {
{{rule_attributes_str}}
            }
        }
    }
}