//cache 系统使用的是 cacheman 具体配置以及支持引擎可以参考（默认支持memory、mongo）
const { toBool } = require('tomjs/handlers/base_tools');
module.exports = {
    engine: process.env.CACHE_ENGINE || 'mongo',//存储引擎
    host: process.env.CACHE_HOST || 'localhost',//主机地址
    port: process.env.CACHE_PORT || 27017,//端口
    username: process.env.CACHE_USERNAME || '',
    password: process.env.CACHE_PASSWORD || '',
    database: process.env.CACHE_DATABASE || 'test',
    collection: process.env.CACHE_COLLECTION || 'tom_cache',
    ttl: process.env.CACHE_TTL || 7200,//两个小时
    compression: toBool(process.env.CACHE_COMPRESSION || false),
};
