const path = require('path');
const { toBool } = require('tomjs/handlers/base_tools');

// 系统配置
module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',

    server_run_type: process.env.SERVER_RUN_TYPE || 'http', // "http", "https", "http and https", "http force https"
    server_url_type: process.env.SERVER_URL_TYPE || 'http://', // 服务器协议类型,包含"http://"或"https://"
    server_host: process.env.SERVER_HOST || 'localhost', // 服务器暴露的域名地址,如果没有以"http"开头表示根据server_url_type server_host server_http_port 或 server_https_port动态生成url 否则就直接使用本变量的值
    fn_server_access_control_allow_origin: null,//async (ctx) => {if (ctx.request.header.origin) { return ctx.request.header.origin; }}, //主要处理多域名访问问题
    server_access_control_allow_origin: process.env.SERVER_ACCESS_CONTROL_ALLOW_ORIGIN,//允许跨域配置，如果不允许就不要填写任何内
    server_http_port: process.env.SERVER_HTTP_PORT || '80', // 服务器监听的http端口号
    server_https_port: process.env.SERVER_HTTPS_PORT || '443', // 服务器监听的https端口号
    server_bind_ip: process.env.SERVER_BIND_IP || '0.0.0.0', // 服务器绑定IP
    server_timeout: process.env.SERVER_TIMEOUT || 60000,//单位毫秒
    ssl_options: {
        key_file: process.env.SERVER_HTTPS_KEY_FILE || 'https.key',//默认在keys目录下
        cert_file: process.env.SERVER_HTTPS_CRT_FILE || 'https.crt'
    },

    websocket_open: toBool(process.env.WEBSOCKET_OPEN || false),
    websocket_options:{
    },
    websocket_auto_error_send: false,

    country: process.env.SYSTEM_COUNTRY || 'zh-cn', // 所在国家的国家代码
    plugin_path: process.env.SYSTEM_PLUGIN_PATH || path.join(__dirname, './plugins'), // 插件路径
    session_key: process.env.SYSTEM_SESSION_KEY || 'RESTfulAPI', // 生产环境务必随机设置一个值

    jwt_secret: process.env.JWT_SECRET || 'publicKey.pub', // jwt需要的Key文件名

    Lang:process.env.DEFAULT_LANG || 'zh-CN',//默认语言
    languages:process.env.LANGUAGES || 'zh-CN,en-US',//允许的语言范围以 , 进行分割
    lang_cookie_key: 'lang',

    log4js_category: process.env.APP_LOG_CATEGORY ||"app",
    log4js_websocket_category: process.env.WEBSOCKET_LOG_CATEGORY ||"websocket",
    log4js_error_category: process.env.ERROR_LOG_CATEGORY || "error",
    
    all_error_web_show:toBool(process.env.ALL_ERROR_WEB_SHOW || false),

    web_conditional_get: true,//开启后让静态文件只有被修改后才会重新从服务器上获取
}
