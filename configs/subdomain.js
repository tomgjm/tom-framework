const { toBool } = require('tomjs/handlers/base_tools');
module.exports = {
    response_api_formatter: {
        hostname: '^api',
        //path: '^/api',
    },
    websocket_socket_routes_path: './websocket/routes/socket/',
    subdomain_offset: process.env.SUBDOMAIN_OFFSET || 2,
    maps: {
        // "dev": {
        //     proxy: "http://127.0.0.1:8010",
        // },
        "api": {
            web: "./routes/api.js",
            websocket: './websocket/routes/api.js',
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
            // ip: {
            //     whitelist: ['172.18.*.*'],
            //     blacklist: ['127.0.0.*'],
            //     handler: async (ctx, next) => {
            //         //handle blacklist ip
            //         console.log("* ip handler");
            //     }
            // }
        },
    }
}