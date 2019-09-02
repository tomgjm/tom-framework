const { toBool } = require('tomjs/handlers/base_tools')
module.exports = {
    default: process.env.DB_TYPE || "mongodb",
    await: toBool(process.env.DB_AWAIT) || true,
    mongodb: {
        type: "mongodb",
        url: process.env.DB_URL,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
        database: process.env.DB_DATABASE || 'test',
        username: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || '',
        options: {
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD,
            authSource: process.env.DB_AUTHSOURCE,
            autoIndex: toBool(process.env.DB_AUTOINDEX),
            keepAlive: process.env.DB_KEEPALIVE,
            bufferCommands: toBool(process.env.DB_BUFFERCOMMANDS),
            useNewUrlParser: toBool(process.env.DB_USENEWURLPARSER || true),
            autoReconnect: toBool(process.env.DB_AUTORECONNECT),
            reconnectTries: process.env.DB_RECONNECTTRIES,
            reconnectInterval: process.env.DB_RECONNECTINTERVAL,
            poolSize: process.env.DB_POOLSIZE,
            bufferMaxEntries: process.env.DB_BUFFERMAXENTRIES,
        },
        showConnInfo: toBool(process.env.DB_SHOW_CONN_INFO),
    },
    mysql: {
        type: "mysql",
        url: '',
        useCLS: true,
        namespaceCLS:'mysql_namespaceCLS',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_DATABASE || 'tomjs',
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'root',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        showConnInfo: toBool(process.env.DB_SHOW_CONN_INFO),
    },
}