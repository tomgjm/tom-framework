module.exports = {
    default: {
        redis_cfg: process.env.RATELIMIT_DEFAULT_REDIS_URL || "redis://127.0.0.1:6379/0",
        //redis_cfg 也可以如下配置
        // redis_cfg:{
        //     port: 6379,          // Redis port
        //     host: '127.0.0.1',   // Redis host
        //     family: 4,           // 4 (IPv4) or 6 (IPv6)
        //     password: 'auth',
        //     db: 0
        //   },
        options: {
            duration: process.env.RATELIMIT_DEFAULT_DURATION || 60000,//时间范围 单位毫秒 也可以用字符串 1d：一天 1h：一小时 1m：一分钟 来表示
            errorMessage: 'too many requests',
            //prefixKey: 'default',
            //or
            //id: (ctx) => 'default '+ ctx.ip,
            headers: {
                remaining: 'Rate-Limit-Remaining',
                reset: 'Rate-Limit-Reset',
                total: 'Rate-Limit-Total',
            },
            max: process.env.RATELIMIT_DEFAULT_MAX || 10,
            disableHeader: false,
            show_api_error: true,
        },
        whitelist: ["::1", "127.0.0.1"],//白名单 支持 数组，字符串（可用,分割）以及函数 参数有ctx,ip 返回 true或false 函数可以是 async 函数
        blacklist: [],//黑名单 支持 数组，字符串（可用,分割）以及函数 参数有ctx,ip 返回 true或false 函数可以是 async 函数（黑名单优先于白名单）
        blackMessage: 'This is forbidden area for you.',
    },
    mobile: {
        //不设置 redis_url 就表示使用本机内存
        options: {
            duration: process.env.RATELIMIT_MOBILE_DURATION || '1m',
            errorMessage: 'too many requests',
            headers: {
                remaining: 'Rate-Limit-Remaining',
                reset: 'Rate-Limit-Reset',
                total: 'Rate-Limit-Total',
            },
            max: process.env.RATELIMIT_MOBILE_MAX || 1,
            disableHeader: false,
            show_api_error: false,
        },
        //whitelist: ["::1", "127.0.0.1"],
        blacklist: [],
        blackMessage: 'This is forbidden area for you.',
    },
    login: {
        //不设置 redis_url 就表示使用本机内存
        options: {
            duration: process.env.RATELIMIT_LOGIN_DURATION || '1m',
            errorMessage: 'too many requests',
            headers: {
                remaining: 'Rate-Limit-Remaining',
                reset: 'Rate-Limit-Reset',
                total: 'Rate-Limit-Total',
            },
            max: process.env.RATELIMIT_LOGIN_MAX || 5,
            disableHeader: false,
            show_api_error: true,
        },
        //whitelist: ["::1", "127.0.0.1"],
        blacklist: [],
        blackMessage: 'This is forbidden area for you.',
    },
};