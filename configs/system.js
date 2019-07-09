const path = require('path');
const { toBool } = require('tomjs/handlers/tools');

// 系统配置
module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',

    api_server_type: process.env.API_SERVER_TYPE || 'http://', // API服务器协议类型,包含"http://"或"https://"
    api_server_host: process.env.API_SERVER_HOST || 'api.localhost', // API服务器暴露的域名地址,请勿添加"http://"
    api_server_port: process.env.API_SERVER_PORT || '5000', // API服务器监听的端口号
    api_server_bind_ip: process.env.API_SERVER_BIND_IP || '0.0.0.0', // API服务器绑定IP
    api_server_timeout: process.env.API_SERVER_TIMEOUT || 60000,//单位毫秒

    http_server_type: process.env.HTTP_SERVER_TYPE || 'http://', // HTTP服务器协议类型,包含"http://"或"https://"
    http_server_host: process.env.HTTP_SERVER_HOST || 'www.localhost', // HTTP服务器暴露的域名地址,请勿添加"http://"
    http_server_port: process.env.HTTP_SERVER_PORT || '80', // HTTP服务器监听的端口号
    http_server_bind_ip: process.env.HTTP_SERVER_BIND_IP || '0.0.0.0', // HTTP服务器绑定IP
    http_server_timeout:  process.env.HTTP_SERVER_TIMEOUT || 60000,//单位毫秒

    country: process.env.SYSTEM_COUNTRY || 'zh-cn', // 所在国家的国家代码
    plugin_path: process.env.SYSTEM_PLUGIN_PATH || path.join(__dirname, './plugins'), // 插件路径
    session_key: process.env.SYSTEM_SESSION_KEY || 'RESTfulAPI', // 生产环境务必随机设置一个值

    jwt_secret: process.env.JWT_SECRET || 'publicKey.pub', // jwt需要的Key文件名

    Lang:process.env.DEFAULT_LANG || 'zh-CN',//默认语言
    languages:process.env.LANGUAGES || 'zh-CN,en',//允许的语言范围以 , 进行分割
    lang_cookie_key: 'lang',

    log4js_category: process.env.APP_LOG_CATEGORY ||"app",

    log4js_error_category: process.env.ERROR_LOG_CATEGORY || "error",
    all_error_web_show:toBool(process.env.ALL_ERROR_WEB_SHOW) || true,
}
