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
                // article_id: 'required|string|exists:articles,_id',
                // content: 'required|string',
            },
            attributes: {
                // article_id: ctx.__('article id'),
                // content: ctx.__('content'),
            }
        }
    }

    async update(ctx) {
        //保存更新数据
        return {
            rules: {
                // id: 'required|string|exists:article_comments,_id',
                // content: 'required|string',
            },
            attributes: {
                // content: ctx.__('content'),
            }
        }
    }
}