//cache 系统使用的是 cacheman 具体配置以及支持引擎可以参考（默认支持memory、tom-cacheman-mongodb）
const { toBool } = require('tomjs/handlers/base_tools')
module.exports = {
    session_key:'tomjs:sess',
    type:'token',//如果设置为 cookie 那么token完全失效，但如果设置为token，在没有认证通过前会以cookie方式工作
    token_id:'jwt_key_id',//type为'toekn'时，采用配置auth.js中的tokenKey还是jwt_key_id来作为token_id并替代cookie id
    prefix:'s',
    store: {
        engine: process.env.SESSION_ENGINE || 'tom-cacheman-mongodb', //存储引擎
        host: process.env.SESSION_HOST || 'localhost', //主机地址
        port: process.env.SESSION_PORT || 27017, //端口
        username: process.env.SESSION_USERNAME || '',
        password: process.env.SESSION_PASSWORD || '',
        database: process.env.SESSION_DATABASE || 'test',
        collection: process.env.SESSION_COLLECTION || 'tomjs_session',
        ttl: process.env.SESSION_TTL || 1800, //半个小时
        compression: toBool(process.env.SESSION_COMPRESSION || false),
        prefix:'',
    },
    language_key:'language',
}
