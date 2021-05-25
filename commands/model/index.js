const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();
const render = require2('tomjs/handlers/render');
const { camelize } = require2('tomjs/handlers/tools');
const pluralize = require2('pluralize');
const humps = require2('humps');
const fs = require2("fs");

const VIEW_NAME_MAIN = "main";
const VIEW_NAME_MONGODB = "mongodb";
const VIEW_NAME_MIGRATE = "migrate";
const TEMPLATE_ROOT_PATH = path.join(AppDir, "../commands/model/templates/");

async function run() {
    const argv = require('minimist')(process.argv.slice(2));
    if (argv._.length > 1) {
        if (argv._[0] == "create") {
            const file_name = argv._[1];
            const model_name = camelize(file_name) + "Model";
            const collection_name = pluralize.plural(file_name);
            const object_name = humps.pascalize(pluralize.plural(file_name));
            const locals = { file_name, model_name, collection_name, object_name };
            const write_file_main = path.join(AppDir, './models/' + file_name + ".js");
            const write_file_mongodb = path.join(AppDir, './models/mongodb/' + file_name + ".js");
            // const write_file_mysql = path.join(AppDir, './models/mysql/' + file_name + ".js");

            const write_file_migrate = path.join(AppDir, `../migrations/${new Date().getTime()}-create_${file_name}.js`);
            if (!fs.existsSync(write_file_main)) {
                const content = await render(VIEW_NAME_MAIN, locals, undefined, TEMPLATE_ROOT_PATH);
                fs.writeFileSync(write_file_main, content);
                console.log(`Write file OK:${write_file_main}`);
            }
            else {
                console.error("Error: file exists:" + write_file_main);
            }

            if (!fs.existsSync(write_file_mongodb)) {
                const content = await render(VIEW_NAME_MONGODB, locals, undefined, TEMPLATE_ROOT_PATH);
                fs.writeFileSync(write_file_mongodb, content);
                console.log(`Write file OK:${write_file_mongodb}`);
            }
            else {
                console.error("Error: file exists:" + write_file_mongodb);
            }

            if (!fs.existsSync(write_file_migrate)) {
                const content = await render(VIEW_NAME_MIGRATE, locals, undefined, TEMPLATE_ROOT_PATH);
                fs.writeFileSync(write_file_migrate, content);
                console.log(`Write file OK:${write_file_migrate}`);
            }
            else {
                console.error("Error: file exists:" + write_file_migrate);
            }

        }
    }
    else { console.error("no parameters"); }
    process.exit();
}
run();
