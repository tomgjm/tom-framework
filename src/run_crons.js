const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const database = require2('tomjs/database'); //根据配置连接数据库
const configs = require2('tomjs/configs')();

(async function () {
    if (configs.database.await) {
        const [mongoose] = await Promise.all([database.build()]); //需要并行处理的初始化项目，例如数据库连接，读取配置文件等
    } else {
        database.build();
    }
    console.log("run crons runing...");
    const cron = require2('tomjs/handlers/cron');
})();