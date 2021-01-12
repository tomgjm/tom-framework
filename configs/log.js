const { toBool } = require('tomjs/handlers/base_tools')
let LOG_PATH = process.env.LOG_DEFAULT_PATH || "./logs";
module.exports = {
    open_koa_logger: toBool(process.env.LOG_OPEN_KOA_LOGGER || true),
    open_log4js: toBool(process.env.LOG_OPEN_LOG4JS || true),
    show_init_info: toBool(process.env.LOG_SHOW_INIT_INFO || true),
    bind: ['log', 'info', 'error', 'warn'],
    log4js: {
        "pm2": toBool(process.env.LOG_PM2 || false),
        "pm2InstanceVar": process.env.LOG_PM2_INSTANCE_VAR || "INSTANCE_ID",
        "disableClustering": toBool(process.env.LOG_DISABLE_CLUSTERING || false),
        "appenders": {
            "out": {
                "type": process.env.LOG_OUT_DEFAULT_TYPE || "console",
            },
            "default": {
                "type": "dateFile",
                "filename": process.env.LOG_DEFAULT_FILE || (LOG_PATH + "/common-all"),
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
            "app": {
                "type": "dateFile",
                "filename": process.env.LOG_APP_FILE || (LOG_PATH + "/app"),
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
            "sms": {
                "type": "dateFile",
                "filename": process.env.LOG_SMS_FILE || (LOG_PATH + "/sms"),
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
            "email": {
                "type": "dateFile",
                "filename": process.env.LOG_EMAIL_FILE || (LOG_PATH + "/email"),
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
            "user": {
                "type": "dateFile",
                "filename": process.env.LOG_USER_FILE || (LOG_PATH + "/user"),
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
            "getweb": {
                "type": "dateFile",
                "filename": process.env.LOG_GETWEB_FILE || (LOG_PATH + "/getweb"),
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
            "error": {
                "type": "dateFile",
                "filename": process.env.LOG_ERROR_FILE || (LOG_PATH + "/error"),
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
        },
        "categories": {
            "default": { "appenders": ["out", "default",], "level": process.env.LOG_DEFAULT_LEVEL||"debug" },
            "app": { "appenders": ["out", "app",], "level": process.env.LOG_APP_LEVEL||"debug" },
            "sms": { "appenders": ["out", "sms",], "level": process.env.LOG_SMS_LEVEL||"debug" },
            "error": { "appenders": ["out","error",], "level": process.env.LOG_ERROR_LEVEL||"debug" },
            "user": { "appenders": ["user",], "level": process.env.LOG_USER_LEVEL||"debug" },
            "email": { "appenders": ["email",], "level": process.env.LOG_EMAIL_LEVEL||"debug" },
            "getweb": { "appenders": ["getweb",], "level": process.env.LOG_GETWEB_LEVEL||"debug" },
        },
    },
};
