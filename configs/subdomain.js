const { toBool } = require('tomjs/handlers/base_tools');
module.exports = {
    response_api_formatter: {
        hostname: '^api',
        //path: '^/api',
    },
    websocket_socket_routes_path: './websocket/routes/socket/',
    subdomain_offset: process.env.SUBDOMAIN_OFFSET || 2,
    maps: {
        "api": {
            web: "./routes/api.js",
            websocket: './websocket/routes/api.js',
            jwt: {
                //work_path: '/api',
                auth_all_path: toBool(process.env.JWT_AUTH_ALL_PATH || false),//所有work_path路径下是否都要预先经过JWT验证
                unless: {
                    web: {
                        path: [
                            /^\/v[0-9]\/auth\/info/,
                            /^\/v[0-9]\/auth\/captcha/,
                            /^\/v[0-9]\/auth\/login/,
                            /^\/v[0-9]\/auth\/register/,
                            /^\/v[0-9]\/auth\/forgotpassword/,
                        ]
                    },
                    websocket: {
                        path: [/^\/test/,]
                    }
                },
            }
        },
        "*": {
            web: "./routes/web.js",
            static: {
                source_path: 'public',
                target_path: '/',
                options: {
                    maxage: 0,
                    hidden: false,
                    index: "index.html",
                    gzip: true,
                    br: true,
                    defer: true,
                },
            },
            jwt: {
                auth_all_path: toBool(process.env.JWT_AUTH_ALL_PATH || false),//所有work_path路径下是否都要预先经过JWT验证
                unless: {
                    web: {
                        path: [
                            /./,
                        ]
                    },
                    websocket: {
                        path: [/^\/test/,]
                    }
                },
            }
        },
    }
}