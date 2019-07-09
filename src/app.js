const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
require2('tomjs/handlers/log4js'); //日志和控制台输出处理
const SystemConfig = require2('tomjs/configs')().system;
const startRun = require2('tomjs/app');

startRun().then(app => {
    let server = app.listen(SystemConfig.api_server_port, SystemConfig.api_server_bind_ip);
    server.timeout = SystemConfig.api_server_timeout;

    console.log('Now start API server on IP:' + SystemConfig.api_server_bind_ip + ':' + SystemConfig.api_server_port + '...');
}).catch(error => { console.error(error, error.stack); });