const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const log4js = require2('tomjs/handlers/log4js'); //日志和控制台输出处理
const SystemConfig = require2('tomjs/configs')().system;
const startRun = require2('tomjs/app');

startRun().then(({ app, server_http, server_https } = {}) => {
    if (SystemConfig.server_run_type_https) {
        console.log('Now start https server on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_https_port + '...');
    }
    if (SystemConfig.server_run_type_http) {
        console.log('Now start http server on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_http_port
            + (SystemConfig.server_run_type_force_https ? (' force to https IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_https_port) : '...'));
    }
}).catch(error => { console.error(error, error.stack); });

process.on('SIGINT', function () {
    console.log('server SIGINT');
    process.exit(0);
});
process.on('exit', function () {
    console.log('server exit');
    process.exit(0);
});
process.on('uncaughtException', function (e) {
    console.error('uncaught listener', e);
});