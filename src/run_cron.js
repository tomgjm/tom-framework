const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const database = require2('tomjs/database'); //根据配置连接数据库
const configs = require2('tomjs/configs')();

const path = require2('path');
const app_dir = require2('tomjs/handlers/dir')();
const CronsError = require2('tomjs/error/crons_error');

const { isClass, isFunction, isString } = require2('tomjs/handlers/listener_tools');

function checkFunc(func) {
    let reFunc = undefined;
    if (isFunction(func)) { reFunc = func; }
    else if (isString(func)) {
        let file_arr = func.split('@');
        let listener = undefined;
        let filename = path.join(app_dir, './crons/', file_arr[0]);

        let listener_class = require(filename);
        if (isClass(listener_class)) {
            listener = new listener_class();
            let func_name = undefined;
            if (file_arr.length > 1) { func_name = file_arr[1]; }
            if (func_name === undefined) {
                throw new CronsError(CronsError.FUNC_NOT_FIND_ERROR, func);
            }
            if (isFunction(listener[func_name])) {
                reFunc = listener[func_name].bind(listener);
            }
            else {
                throw new CronsError(CronsError.FUNC_NOT_FIND_ERROR, func);
            }
        }
        else if (isFunction(listener_class)) {
            reFunc = listener_class;
        }
        else {
            throw new CronsError(CronsError.FUNC_NOT_FIND_ERROR, func);
        }

    }
    return reFunc;
}

(async function () {
    if (configs.database.await) {
        const [mongoose] = await Promise.all([database.build()]); //需要并行处理的初始化项目，例如数据库连接，读取配置文件等
    } else {
        database.build();
    }
    console.log("cron running...");
    await checkFunc(process.argv[2])();
    console.log("cron end...");
    process.exit(0);
})();