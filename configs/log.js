const { toBool } = require('tomjs/handlers/base_tools')
module.exports = {
    open_koa_logger: toBool(process.env.LOG_OPEN_KOA_LOGGER || true),
    open_log4js: toBool(process.env.LOG_OPEN_LOG4JS || true),
    show_init_info: toBool(process.env.LOG_SHOW_INIT_INFO || true),
    bind: ['log', 'info', 'error', 'warn'],
    log4js: {
        "appenders": {
            "out": {
                "type": "console",
                "category": "console",
            },
            "default": {
                "type": "dateFile",
                "filename": process.env.LOG_DEFAULT_FILE || "./logs/common-all",
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
            "app": {
                "type": "dateFile",
                "filename": process.env.LOG_APP_FILE || "./logs/app",
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
            "sms": {
                "type": "dateFile",
                "filename": process.env.LOG_SMS_FILE || "./logs/sms",
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
            "email": {
                "type": "dateFile",
                "filename": process.env.LOG_EMAIL_FILE || "./logs/email",
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
            "user": {
                "type": "dateFile",
                "filename": process.env.LOG_USER_FILE || "./logs/user",
                "pattern": "_yyyyMMdd.log",
                "alwaysIncludePattern": true,
            },
            "error": {
                "type": "dateFile",
                "filename": process.env.LOG_ERROR_FILE || "./logs/error",
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
        },
    },
};
