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
        },
    }
}