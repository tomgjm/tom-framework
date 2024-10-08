const { toBool, toObject } = require('tomjs/handlers/base_tools');
const wtimeout = 1000;
module.exports = {
    default: process.env.DB_TYPE || "mongodb",
    await: toBool(process.env.DB_AWAIT || true),
    migrate: {
        up_outtime: 5000,
        up_outtime_short: 10,
        down_outtime: 5000,
        down_outtime_short: 10,
    },
    mongodb_wtimeout: wtimeout,
    mongodb_session_options: toObject(process.env.DB_SESSION_OPTIONS) || toObject('{"readConcern": {"level": "majority" },"writeConcern": {"w": "majority","j": true , "wtimeout": ' + wtimeout + '}}'),
    mongodb_schema_options: toObject(process.env.DB_SCHEMA_OPTIONS) || toObject('{"readConcern": {"level": "majority" }}'),
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
            // useNewUrlParser: toBool(process.env.DB_USENEWURLPARSER || true),
            autoReconnect: toBool(process.env.DB_AUTORECONNECT),
            reconnectTries: process.env.DB_RECONNECTTRIES,
            reconnectInterval: process.env.DB_RECONNECTINTERVAL,
            poolSize: process.env.DB_POOLSIZE,
            bufferMaxEntries: process.env.DB_BUFFERMAXENTRIES,
            readPreference: process.env.DB_READPREFERENCE,
            // useUnifiedTopology: true,
            strictQuery: true,
        },
        showConnInfo: toBool(process.env.DB_SHOW_CONN_INFO),
    },
    mysql: {
        type: "mysql",
        url: '',
        useCLS: true,
        namespaceCLS: 'mysql_namespaceCLS',
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