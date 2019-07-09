module.exports = {
    default: {
        redis_cfg: process.env.RATELIMIT_DEFAULT_REDIS_URL || "redis://127.0.0.1:6379/0", //"redis://:authpassword@127.0.0.1:6380/4"
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
            id: (ctx) => ctx.ip + ' ' + ctx.path,
            headers: {
                remaining: 'Rate-Limit-Remaining',
                reset: 'Rate-Limit-Reset',
                total: 'Rate-Limit-Total',
            },
            max: process.env.RATELIMIT_DEFAULT_MAX || 10,
            disableHeader: false,
            throw: true,
        },
        whitelist: ["::1", "127.0.0.1"],//白名单 支持 数组，字符串（可用,分割）以及函数 参数有ctx,ip 返回 true或false 函数可以是 async 函数
        blacklist: [],//黑名单 支持 数组，字符串（可用,分割）以及函数 参数有ctx,ip 返回 true或false 函数可以是 async 函数（黑名单优先于白名单）
    },
    mobile: {
        //不设置 redis_url 参数就直接只用default的redis_cfg的redis_url参数进行连接并且所有没有redis_url参数配置都公共一个redis连接 否则独立开设新的redis连接
        options: {
            duration: process.env.RATELIMIT_MOBILE_DURATION || '1m',
            errorMessage: 'too many requests',
            id: (ctx) => ctx.ip + ' ' + ctx.path,
            headers: {
                remaining: 'Rate-Limit-Remaining',
                reset: 'Rate-Limit-Reset',
                total: 'Rate-Limit-Total',
            },
            max: process.env.RATELIMIT_MOBILE_MAX || 1,
            disableHeader: false,
            throw: true,
        },
        whitelist: ["::1", "127.0.0.1"],
        blacklist: [],
    },
    login: {
        //不设置 redis_url 参数就直接只用default的redis_cfg的redis_url参数进行连接并且所有没有redis_url参数配置都公共一个redis连接 否则独立开设新的redis连接
        options: {
            duration: process.env.RATELIMIT_LOGIN_DURATION || '1m',
            errorMessage: 'too many requests',
            id: (ctx) => ctx.ip + ' ' + ctx.path,
            headers: {
                remaining: 'Rate-Limit-Remaining',
                reset: 'Rate-Limit-Reset',
                total: 'Rate-Limit-Total',
            },
            max: process.env.RATELIMIT_LOGIN_MAX || 5,
            disableHeader: false,
            throw: true,
        },
        whitelist: ["::1", "127.0.0.1"],
        blacklist: [],
    },
};