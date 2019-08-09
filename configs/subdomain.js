module.exports = {
    response_api_formatter: {
        hostname: '^api',
        //path: '^/api',
    },
    subdomain_offset: process.env.SUBDOMAIN_OFFSET || 2,
    maps: {
        "www": "./routes/web.js",
        "api": "./routes/api.js",
    }
}