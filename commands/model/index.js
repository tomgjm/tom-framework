const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();
const render = require2('tomjs/handlers/render');
const { camelize } = require2('tomjs/handlers/tools');
const pluralize = require2('pluralize');
const humps = require2('humps');
const fs = require2("fs");

const BaseCommand = require(path.join(AppDir, '../commands/base_command'));

const VIEW_NAME_MAIN = "main";
const VIEW_NAME_MONGODB = "mongodb";
const VIEW_NAME_MIGRATE = "migrate";
const VIEW_NAME_POLICY = "policy";
const VIEW_NAME_CONTROLLER = "controller";
const VIEW_NAME_RULE = "rule";
const VIEW_NAME_LISTENER = "listener";
const VIEW_NAME_ADMINBRO = "adminbro";
const TEMPLATE_ROOT_PATH = path.join(AppDir, "../commands/model/templates/");


class ModelCommand extends BaseCommand {
    constructor() {
        super({
            cmd_name: "model",
            cmd_info: "This is the command used to generate Model code",
            cmd_args: [
                {
                    must: true,
                    // args: ["-h", "--help"],
                    para: "ModelName",//变量名称
                    show_help_tab_count: 0,//显示 说明、帮助 前面增加或减少 tab显示个数
                    help: "Model Name",//说明、帮助
                    // default, //默认值
                    // action: "help" //默认方法 可是是函数也可以字符串 如果是字符串就是本类的函数名
                },
                {
                    must: false,
                    args: ["-h", "--help"],
                    // para,
                    show_help_tab_count: 0,
                    help: "show this help message and exit",
                    // default,
                    action: "help"
                },
                {
                    must: false,
                    args: ["-v", "--version"],
                    // para,
                    show_help_tab_count: 0,
                    help: "show this version message and exit",
                    // default,
                    action: "version"
                },
                {
                    must: false,
                    args: ["-c", "--create"],
                    // para,
                    show_help_tab_count: 0,
                    help: "create new Model",
                    // default,
                    action: "create_model"
                },
                {
                    must: false,
                    args: ["-o", "--controller"],
                    para: "ControllerPath",
                    show_help_tab_count: -1,
                    help: "create new controller file",
                    default: "api/v1",
                    action: "create_controller"
                },
                {
                    must: false,
                    args: ["-r", "--route"],
                    para: "RouteFile,RouteVarName[,ControllerPath]",
                    show_help_tab_count: 0,
                    help: "add route configure",
                    default: "api,api_v1",
                    action: "add_route"
                },
                {
                    must: false,
                    args: ["-u", "--rule"],
                    para: "RulePath",
                    show_help_tab_count: 0,
                    help: "add controller rule file",
                    default: "api/v1",
                    action: "create_rule"
                },
                {
                    must: false,
                    args: ["-l", "--listener"],
                    para: "ListenerPath",
                    show_help_tab_count: -1,
                    help: "add controller listener file",
                    default: "controllers/api/v1",
                    action: "create_listener"
                },
                {
                    must: false,
                    args: ["-a", "--all"],
                    para: "ControllerPath[,RouteFile,RouteVarName]",
                    show_help_tab_count: 0,
                    help: "create Model and all files",
                    default: "api/v1",
                    action: "all"
                },
                {
                    must: false,
                    args: ["-b", "--adminbro"],
                    para: "CollectionChineseName[,language]",
                    show_help_tab_count: -1,
                    help: "create AdminBro Model files",
                    default: "新表单,zh-CN",
                    action: "create_adminbro"
                },
            ],
            cmd_help_version_keys: ['h', 'help', 'v', 'version'],
            default_show_tab_count: 6,
        });
        this.__version = "1.0.2";
    }

    default() {
        console.log("run end.");
    }

    version() {
        console.log(`Version: ${this.__version}`);
        process.exit();
    }

    async create_model() {
        const file_name = this.__paras["ModelName"];
        const model_name = camelize(file_name) + "Model";
        const collection_name = pluralize.plural(file_name);
        const object_name = humps.pascalize(pluralize.plural(file_name));
        const singular_name = humps.pascalize(pluralize.singular(file_name));
        const locals = { file_name, model_name, collection_name, object_name, singular_name, };
        const write_file_main = path.join(AppDir, './models/' + file_name + ".js");
        const write_file_mongodb = path.join(AppDir, './models/mongodb/' + file_name + ".js");
        const write_file_migrate = path.join(AppDir, `../migrations/${new Date().getTime()}-create_${file_name}.js`);
        const write_file_policy = path.join(AppDir, './policies/' + file_name + "_policy.js");
        // const write_file_mysql = path.join(AppDir, './models/mysql/' + file_name + ".js");

        try {
            if (!fs.existsSync(write_file_main)) {
                const content = await render(VIEW_NAME_MAIN, locals, undefined, TEMPLATE_ROOT_PATH);
                fs.writeFileSync(write_file_main, content);
                console.log(`Write file OK:${write_file_main}`);
            }
            else {
                throw new Error("Error: file exists:" + write_file_main);
            }
        }
        catch (error) {
            console.error(error);
        }

        try {
            if (!fs.existsSync(write_file_mongodb)) {
                const content = await render(VIEW_NAME_MONGODB, locals, undefined, TEMPLATE_ROOT_PATH);
                fs.writeFileSync(write_file_mongodb, content);
                console.log(`Write file OK:${write_file_mongodb}`);
            }
            else {
                throw new Error("Error: file exists:" + write_file_mongodb);
            }
        }
        catch (error) {
            console.error(error);
        }

        try {
            if (!fs.existsSync(write_file_migrate)) {
                const content = await render(VIEW_NAME_MIGRATE, locals, undefined, TEMPLATE_ROOT_PATH);
                fs.writeFileSync(write_file_migrate, content);
                console.log(`Write file OK:${write_file_migrate}`);
            }
            else {
                throw new Error("Error: file exists:" + write_file_migrate);
            }
        }
        catch (error) {
            console.error(error);
        }

        try {
            if (!fs.existsSync(write_file_policy)) {
                const content = await render(VIEW_NAME_POLICY, locals, undefined, TEMPLATE_ROOT_PATH);
                fs.writeFileSync(write_file_policy, content);
                console.log(`Write file OK:${write_file_policy}`);
            }
            else {
                throw new Error("Error: file exists:" + write_file_policy);
            }
            //写configs/models.js 中的 policies 属性
            const write_file_models = path.join(AppDir, `../configs/models.js`);
            if (fs.existsSync(write_file_models)) {
                const content = fs.readFileSync(write_file_models, 'utf8');
                const finds = content.match(/\b(policies:\s?{[\s\S]*?)(\S)([\s]*?})/);
                if (finds.length == 4) {
                    const allAttr = finds[1].split("\n");
                    let prefix = "";
                    if (allAttr.length > 1) {
                        const oneFinds = allAttr[1].match(/^\s*/);
                        prefix = "\n" + (oneFinds.length > 0 ? oneFinds[0] : '');
                    }
                    const addContent = `${prefix}${model_name}: './policies/${file_name}_policy',`;

                    const content_arr = content.split(finds[0]);
                    const new_content = content_arr[0]
                        + finds[1] + finds[2] + (finds[2] == ',' ? '' : ',')
                        + addContent
                        + finds[3]
                        + content_arr[1];
                    fs.writeFileSync(write_file_models, new_content);
                    console.log(`Modify file OK:${write_file_models}`);
                }
                else {
                    throw new Error("Error: policies attribute error!");
                }
            }
            else {
                throw new Error("Error: not exists:" + write_file_models);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    async create_controller(ControllerPath) {
        const m_name = this.__paras["ModelName"];
        const model_name = camelize(m_name) + "Model";
        const model_object = humps.pascalize(pluralize.plural(m_name));
        const controller = humps.pascalize(pluralize.singular(m_name));
        const document = humps.decamelize(pluralize.singular(m_name));
        const locals = { file_name: m_name, model_name, model_object, controller, document };
        const file_name = pluralize.plural(m_name);
        const write_file_controller = path.join(AppDir, './controllers/', ControllerPath + "/" + file_name + ".js");

        try {
            if (!fs.existsSync(write_file_controller)) {
                const content = await render(VIEW_NAME_CONTROLLER, locals, undefined, TEMPLATE_ROOT_PATH);
                fs.writeFileSync(write_file_controller, content);
                console.log(`Write file OK:${write_file_controller}`);
            }
            else {
                throw new Error("Error: file exists:" + write_file_controller);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    async add_route(info) {
        let [file_name, var_name, ControllerPath] = info.split(",");
        ControllerPath = ControllerPath || this.__paras["ControllerPath"];
        if (!ControllerPath) {
            throw new Error("add route need argument:ControllerPath!")
        }
        const ModelName = this.__paras["ModelName"];
        // const model_name = camelize(file_name) + "Model";
        const url_path_name = pluralize.plural(ModelName);
        // const object_name = humps.pascalize(pluralize.plural(file_name));
        // const singular_name = humps.pascalize(pluralize.singular(file_name));
        // const locals = { file_name, model_name, collection_name, object_name, singular_name, };
        const file_name_arr = file_name.split('.');
        if (file_name_arr.length == 1) { file_name += ".js"; }
        const write_file_route = path.join(AppDir, './routes/' + file_name);

        try {
            if (fs.existsSync(write_file_route)) {
                const content = fs.readFileSync(write_file_route, 'utf8');
                const regx1 = new RegExp(".*?\\b" + var_name + "\\.(?!routes|allowedMethods).+?\\([\\s\\S]*?\\).*", "g");//
                let finds = content.match(regx1);
                if (!finds || finds.length == 0) {
                    const regx2 = new RegExp(".*?\\b" + var_name + "\\s*=\\s*new\\b[\\s\\S]*?\\).*");
                    finds = content.match(regx2);
                }
                if (finds && finds.length > 0) {
                    const splitStr = finds[finds.length - 1];
                    let prefix = "\r\n";
                    for (let index = 0; index < splitStr.length; index++) {
                        const element = splitStr[index];
                        if (element === '\t' || element === ' ') {
                            prefix += element;
                        }
                        else { break; }
                    }
                    prefix += `api_v1.resource('/${url_path_name}/', '${ControllerPath}/${url_path_name}', { name: '${url_path_name}' });`;

                    const content_arr = content.split(splitStr);
                    const new_content = content_arr[0] + splitStr
                        + prefix
                        + (content_arr[1] ? content_arr[1] : "");
                    fs.writeFileSync(write_file_route, new_content);
                    console.log(`Modify file OK:${write_file_route}`);
                }
                else {
                    throw new Error("Error: not find  Route Var:" + var_name);
                }
            }
            else {
                throw new Error("Error: not exists:" + write_file_route);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    async create_rule(RulePath) {
        const m_name = this.__paras["ModelName"];
        const file_name = pluralize.plural(m_name);
        const class_name = humps.pascalize(pluralize.singular(m_name));
        const locals = { class_name, };
        const write_file_rule = path.join(AppDir, './rules/', RulePath + "/" + file_name + ".js");

        try {
            if (!fs.existsSync(write_file_rule)) {
                const content = await render(VIEW_NAME_RULE, locals, undefined, TEMPLATE_ROOT_PATH);
                fs.writeFileSync(write_file_rule, content);
                console.log(`Write file OK:${write_file_rule}`);
            }
            else {
                throw new Error("Error: file exists:" + write_file_rule);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    async create_listener(ListenerPath) {
        const m_name = this.__paras["ModelName"];
        const file_name = pluralize.plural(m_name);
        const class_name = humps.pascalize(pluralize.singular(m_name));
        const locals = { class_name, };
        const write_file_listener = path.join(AppDir, './listeners/', ListenerPath + "/" + file_name + "_log_listener.js");
        const write_file_listener_cfg = path.join(AppDir, `../configs/listener.js`);

        try {
            let write_file_listener_dir = './listeners';
            ListenerPath.split("/").map((dir) => {
                write_file_listener_dir += `/${dir}`;
                const newDir = path.join(AppDir, write_file_listener_dir);
                if (!fs.existsSync(newDir)) {
                    fs.mkdirSync(newDir);
                }
            })
            if (!fs.existsSync(write_file_listener)) {
                const content = await render(VIEW_NAME_LISTENER, locals, undefined, TEMPLATE_ROOT_PATH);
                fs.writeFileSync(write_file_listener, content);
                console.log(`Write file OK:${write_file_listener}`);
            }
            else {
                throw new Error("Error: file exists:" + write_file_listener);
            }


            if (fs.existsSync(write_file_listener_cfg)) {
                const content = fs.readFileSync(write_file_listener_cfg, 'utf8');
                const regx1 = new RegExp(`.*?\\b${ListenerPath}/[\\s\\S]*?[\\]].*`, "g");
                const regx2 = new RegExp(`\\bmodule\\.exports\\s*=\\s*{.*`);
                let finds = content.match(regx1);
                let prefix = "\r\n";
                let splitStr = undefined;
                if (finds && finds.length > 0) {
                    splitStr = finds[finds.length - 1];
                    for (let index = 0; index < splitStr.length; index++) {
                        const element = splitStr[index];
                        if (element === '\t' || element === ' ') {
                            prefix += element;
                        }
                        else { break; }
                    }
                }
                else {
                    finds = content.match(regx2);
                    if (finds && finds.length > 0) {
                        splitStr = finds[finds.length - 1];
                        prefix += "    ";
                    }
                }
                if (finds && finds.length > 0) {
                    prefix += `"${class_name}Controller": ["${ListenerPath}/${file_name}_log_listener.js"],`;
                    const content_arr = content.split(splitStr);
                    const new_content = content_arr[0] + splitStr
                        + prefix
                        + (content_arr[1] ? content_arr[1] : "");
                    fs.writeFileSync(write_file_listener_cfg, new_content);
                    console.log(`Modify file OK:${write_file_listener_cfg}`);
                }
                else {
                    throw new Error("Error: not find Route Var:" + var_name);
                }
            }
            else {
                throw new Error("Error: not exists:" + write_file_listener_cfg);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    async all(AllPath) {
        // ControllerPath[, RouteFile, RouteVarName]
        try {
            const allPathArr = AllPath.split(",");
            let ControllerPath = undefined;
            let RouteFile = undefined;
            let RouteVarName = undefined;
            switch (allPathArr.length) {
                case 1:
                    {
                        ControllerPath = AllPath;
                        const cpArr = ControllerPath.split('/');
                        RouteFile = cpArr[0];
                        RouteVarName = cpArr.join("_");
                        break;
                    }
                case 3:
                    {
                        ControllerPath = allPathArr[0];
                        RouteFile = allPathArr[1];
                        RouteVarName = allPathArr[2];
                        break;
                    }
                default:
                    throw new Error("all parameter error!");
                    break;
            }

            const route_info = `${RouteFile},${RouteVarName},${ControllerPath}`;
            const ListenerPath = "controllers/" + ControllerPath;
            this.__paras["ControllerPath"] = ControllerPath;
            this.__paras["RouteFile,RouteVarName[,ControllerPath]"] = route_info;
            this.__paras["RulePath"] = ControllerPath;
            this.__paras["ListenerPath"] = ListenerPath;

            await this.create_model();
            await this.create_controller(ControllerPath);
            await this.add_route(route_info);
            await this.create_rule(ControllerPath);
            await this.create_listener(ListenerPath);
        }
        catch (error) {
            console.error("Error:" + error.message);
        }
    }

    async create_adminbro(chinese_collection_name_info) {
        let [chinese_collection_name, language] = chinese_collection_name_info.split(",");
        if (!language) { language = "zh-CN"; }
        const m_name = this.__paras["ModelName"];
        const file_name = pluralize.plural(m_name);
        const model_class = humps.pascalize(pluralize.singular(m_name)) + "Model";
        const object_name = humps.pascalize(pluralize.plural(file_name));
        const en_collection_name = humps.decamelize(object_name, { separator: ' ' });
        const locals = { model_class, en_collection_name, object_name, m_name };
        const model_dir = path.join(AppDir, `./adminbro/resources/${model_class}`);
        const write_model_file = model_dir + "/index.js";
        const model_dir_index_file = path.join(AppDir, `./adminbro/resources/index.js`);

        try {
            if (!fs.existsSync(model_dir)) {
                fs.mkdirSync(model_dir);
            }
            if (!fs.existsSync(write_model_file)) {
                const content = await render(VIEW_NAME_ADMINBRO, locals, undefined, TEMPLATE_ROOT_PATH);
                fs.writeFileSync(write_model_file, content);
                console.log(`Write file OK:${write_model_file}`);
            }
            else {
                throw new Error("Error: file exists:" + write_model_file);
            }

            if (fs.existsSync(model_dir_index_file)) {
                const content = fs.readFileSync(model_dir_index_file, 'utf8');
                const regx1 = new RegExp(`\\s*?const\\s+.*?\\s+=\\s+require.*`, "g");
                const regx2 = new RegExp(`module\\s*.\\s*exports\\s*=\\s*\\{.*`);
                let finds = content.match(regx1);
                let prefix = "\r\n";
                let splitStr = undefined;
                let new_content = "";
                if (finds && finds.length > 0) {
                    splitStr = finds[finds.length - 1];
                    for (let index = 0; index < splitStr.length; index++) {
                        const element = splitStr[index];
                        if (element === '\t' || element === ' ') {
                            prefix += element;
                        }
                        else { break; }
                    }
                    prefix += `const ${model_class} = require('./${model_class}');`;
                    const content_arr = content.split(splitStr);
                    new_content = content_arr[0] + splitStr
                        + prefix
                        + (content_arr[1] ? content_arr[1] : "");
                }
                else {
                    new_content = `const ${model_class} = require('./${model_class}');\r\n` + content;
                }

                finds = new_content.match(regx2);
                splitStr = undefined;
                if (finds && finds.length > 0) {
                    const content_arr = new_content.split(finds[0]);
                    new_content = content_arr[0]
                        + finds[0]
                        + `\r\n\t${model_class},`
                        + (content_arr[1] ? content_arr[1] : "");
                    fs.writeFileSync(model_dir_index_file, new_content);
                    console.log(`Modify file OK:${model_dir_index_file}`);
                }
                else {
                    throw new Error("Error: not find 'module.exports = {'");
                }
            }
            else {
                throw new Error("Error: not exists:" + model_dir_index_file);
            }

            const write_file_language = path.join(AppDir, `/language/${language}.js`);
            if (fs.existsSync(write_file_language)) {
                const content = fs.readFileSync(write_file_language, 'utf8');
                const finds = content.match(/adminbor\s*:\s*{.*?[\r\n](\s*)/);
                if (finds.length > 0) {
                    const allAttr = finds[1].split("\n");
                    let prefix = "";
                    if (allAttr.length > 1) {
                        const iL = allAttr.length - 1;
                        for (let index = 0; index < allAttr[iL].length; index++) {
                            const element = allAttr[iL][index];
                            if (element === '\t' || element === ' ') {
                                prefix += element;
                            }
                            else { break; }
                        }
                    }
                    const addContent = `"${en_collection_name}": "${chinese_collection_name}",\r\n${prefix}`;

                    const content_arr = content.split(finds[0]);
                    const new_content = content_arr[0]
                        + finds[0]
                        + addContent
                        + content_arr[1];
                    fs.writeFileSync(write_file_language, new_content);
                    console.log(`Modify file OK:${write_file_language}`);
                }
                else {
                    throw new Error(`Error: language:${language} attribute:"adminbor" error!`);
                }
            }
            else {
                throw new Error("Error: not exists:" + write_file_language);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}

const cmd = new ModelCommand();
cmd.run();