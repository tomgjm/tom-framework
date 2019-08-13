module.exports = {
    response_api_formatter: {
        hostname: '^api',
        //path: '^/api',
    },
    subdomain_offset: process.env.SUBDOMAIN_OFFSET || 2,
    maps: {
        "*": {
            route: "./routes/web.js",
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
        "api": {
            route: "./routes/api.js",            
        },
    }
}