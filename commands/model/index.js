const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();
const render = require2('tomjs/handlers/render');
const { isString, isObject, camelize, mkdirsSync } = require2('tomjs/handlers/tools');
const pluralize = require2('pluralize');
const humps = require2('humps');
const fs = require2("fs");

const loose_json = require('loose-json');

const BaseCommand = require(path.join(AppDir, '../commands/base_command'));

const VIEW_NAME_MAIN = "main";
const VIEW_NAME_MONGODB = "mongodb";
const VIEW_NAME_MIGRATE = "migrate";
const VIEW_NAME_POLICY = "policy";
const VIEW_NAME_CONTROLLER = "controller";
const VIEW_NAME_RULE = "rule";
const VIEW_NAME_LISTENER = "listener";
const VIEW_NAME_ADMINBRO = "adminbro";
const VIEW_NAME_PQL = "pql_";
const TEMPLATE_ROOT_PATH = path.join(AppDir, "../commands/model/templates/");

const API_VERSION = "api_version";
const API_VERSION_DEFAULT = "v1";

function delQuotes(str) {
    str = ('' + str).trim();
    const str_len = str.length - 1;
    if (str[0] === '"' && str[str_len] === '"') {
        //去读掉两头 双引号
        str = str.substring(1, str_len);
    }
    else if (str[0] === "'" && str[str_len] === "'") {
        //去读掉两头 单引号
        str = str.substring(1, str_len);
    }
    return str;
}

function delParentheses(str) {
    const str_len = str.length - 1;
    if (str[0] === '"' && str[str_len] === '"') {
        //去读掉两头 双引号
        str = str.substring(1, str_len);
    }
    else if (str[0] === "'" && str[str_len] === "'") {
        //去读掉两头 单引号
        str = str.substring(1, str_len);
    }
    return str;
}

function objectToPQL(obj, delParentheses = false) {
    const pqlObj = Object.assign({}, obj);
    for (const key in pqlObj) {
        pqlObj[key] = 1;
    }
    let str = JSON.stringify(pqlObj, null, 4);
    if (delParentheses) {
        const str_len = str.length - 1;
        if (str[0] === '{' && str[str_len] === '}') {
            //去读掉两头 双引号
            str = str.substring(1, str_len);
        }
    }
    return str.trim();
}

function stringify(obj_from_json, fn, num) {
    if (typeof obj_from_json !== "object" || Array.isArray(obj_from_json)) {
        // not an object, stringify using native function
        return JSON.stringify(obj_from_json, fn, num);
    }
    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    let props = Object
        .keys(obj_from_json)
        .map(key => `${key}:${stringify(obj_from_json[key], fn, num)}`)
        .join(",");
    return `{${props}}`;
}

class ModelCommand extends BaseCommand {
    constructor() {
        super({
            cmd_name: "model",
            cmd_info: "This is the command used to generate Model code",
            cmd_args: [
                {
                    must: true,
                    // args: ["-h", "--help"],
                    para: "model_name",//变量名称
                    show_help_tab_count: 0,//显示 说明、帮助 前面增加或减少 tab显示个数
                    help: "Model Name",//说明、帮助
                    // default, //默认值
                    // action: "help" //默认方法 可是是函数也可以字符串 如果是字符串就是本类的函数名
                },
                {
                    must: false,
                    args: ["-i", "--apiversion"],
                    para: API_VERSION,//变量名称
                    show_help_tab_count: -1,//显示 说明、帮助 前面增加或减少 tab显示个数
                    help: "set default api version",//说明、帮助
                    default: API_VERSION_DEFAULT, //默认值
                    action: "set_api_version" //默认方法 可是是函数也可以字符串 如果是字符串就是本类的函数名
                },
                {
                    must: false,
                    args: ["-f", "--fields"],
                    para: "Fields",
                    show_help_tab_count: -1,
                    help: "Model fields definition",
                    // default,
                    action: "fields"
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
                    default: "api/${" + API_VERSION + "}",
                    action: "create_controller"
                },
                {
                    must: false,
                    args: ["-r", "--route"],
                    para: "RouteFile,RouteVarName[,ControllerPath]",
                    show_help_tab_count: 0,
                    help: "add route configure",
                    default: "api,api_${" + API_VERSION + "}",
                    action: "add_route"
                },
                {
                    must: false,
                    args: ["-u", "--rule"],
                    para: "RulePath",
                    show_help_tab_count: 0,
                    help: "add controller rule file",
                    default: "api/${" + API_VERSION + "}",
                    action: "create_rule"
                },
                {
                    must: false,
                    args: ["-l", "--listener"],
                    para: "ListenerPath",
                    show_help_tab_count: -1,
                    help: "add controller listener file",
                    default: "controllers/api/${" + API_VERSION + "}",
                    action: "create_listener"
                },
                {
                    must: false,
                    args: ["-p", "--pql"],
                    para: "PQLPath",
                    show_help_tab_count: 0,
                    help: "add controller PQL file",
                    default: "public/api/${" + API_VERSION + "}",
                    action: "create_pql"
                },
                {
                    must: false,
                    args: ["-a", "--all"],
                    para: "ControllerPath[,RouteFile,RouteVarName]",
                    show_help_tab_count: 0,
                    help: "create Model and all files",
                    default: "api/${" + API_VERSION + "}",
                    action: "all"
                },
                {
                    must: false,
                    args: ["-b", "--adminbro"],
                    para: "CollectionChineseName[,languages]",
                    show_help_tab_count: -1,
                    help: "create AdminBro Model files",
                    default: "新表单,zh-CN|en",
                    action: "create_adminbro"
                },
            ],
            cmd_help_version_keys: ['h', 'help', 'v', 'version'],
            default_show_tab_count: 6,
        });
        this.__version = "1.1.5";
        this.__fields_lang__ = {};
    }


    before() {
    }

    after() {
        console.log("run end.");
    }

    stringifyNotQuotes(obj_key, obj, fn, num) {
        // return JSON.stringify(obj, fn, num).replace(/\\"/g, "\uFFFF").replace(/"([^"]+)":/g, '$1:').replace(/\uFFFF/g, '\\\"');
        if (isString(obj)) {
            return obj;
        }
        else if (!isObject(obj) || Array.isArray(obj)) {
            // not an object, stringify using native function
            return JSON.stringify(obj, fn, num);
        }
        // Implements recursive object serialization according to JSON spec
        // but without quotes around the keys.

        const TemplateObj = {
            type: "String",//字段类型
            required: true,//是否为必须字段
            index: true,//是否索引
            unique: true,//是否不重复
            sparse: true,//不重复但可以有空值
            default: '""',//默认值
            validate: "validate({ validator: 'isEMail' })",//验证规则
        }

        let props = Object
            .keys(obj)
            .map(key => {
                let re = undefined;
                switch (key) {
                    case "type":
                    case "validate":
                        re = `${key}: ${obj[key]}`;
                        break;
                    case "__lang__":
                        this.__fields_lang__[obj_key] = obj[key];
                        re = undefined;
                        break;
                    default:
                        re = `${key}: ${JSON.stringify(obj[key], fn, num)}`;
                        break;
                }
                if (TemplateObj[key]) { delete TemplateObj[key]; }
                return re ? "\n" + "\t".repeat(num) + re : undefined;
            })
            .filter(item => item !== undefined)
            .concat(
                Object
                    .keys(TemplateObj)
                    .map(key => {
                        return "\n" + "\t".repeat(num) + (key === "type" ? '' : '// ') + `${key}: ${TemplateObj[key]}`;
                    })
            )
            .join(",") + "\n" + "\t".repeat(num - 1);
        return `{${props}}`;
    }

    getLangString(lang) {
        let str = '';
        for (const key in this.__fields_lang__) {
            const element = this.__fields_lang__[key];
            if (element[lang]) {
                str += (str === "" ? "" : "\r\n") + ' '.repeat(8) + `"${key}": "${element[lang]}",`;
            }
        }
        return str;
    }

    adminbro_fields_str(model_class) {
        let fields_str = '';
        let fields_list_str = '';
        if (isObject(this.__paras['Fields'])) {
            for (const key in this.__paras['Fields']) {
                fields_str += (fields_str === '' ? '' : "\r\n") + " ".repeat(8) + `${key}:  __('${model_class}.${key}'),`;
                fields_list_str += `"${key}", `;
            }
        }

        return { fields_str, fields_list_str };
    }


    version() {
        console.log(`Version: ${this.__version}`);
        process.exit();
    }

    set_api_version(api_version) {
        this.__paras[API_VERSION] = api_version;
    }

    async create_model() {
        const file_name = this.__paras["model_name"];
        const model_name = camelize(file_name) + "Model";
        const collection_name = pluralize.plural(file_name);
        const object_name = humps.pascalize(pluralize.plural(file_name));
        const singular_name = humps.pascalize(pluralize.singular(file_name));
        const fields_str = this.__paras['Fields_str'] ? this.__paras['Fields_str'] :
            '          field_name: {\n                type: String,//字段类型\n                // required: true,//是否为必须字段\n                // index: true,//是否索引\n                // unique: true,//是否不重复\n                // sparse: true,//不重复但可以有空值\n                // default: "",//默认值\n                // validate: validate({ validator: "isEMail" }),//验证规则\n            },\n';
        const fields_ref_str = this.__paras['Fields_ref_str'] ? this.__paras['Fields_ref_str'] : "";
        const locals = { file_name, model_name, collection_name, object_name, singular_name, fields_str, fields_ref_str };
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
        const m_name = this.__paras["model_name"];
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
        const ModelName = this.__paras["model_name"];
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
        const m_name = this.__paras["model_name"];
        const file_name = pluralize.plural(m_name);
        const class_name = humps.pascalize(pluralize.singular(m_name));

        const rule_str = this.__paras['Fields_rule_str'];
        const rule_attributes_str = this.__paras['Fields_rule_attributes_str'];
        const locals = { class_name, rule_str, rule_attributes_str };
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
        const m_name = this.__paras["model_name"];
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

    async create_pql(PQLPath) {
        const m_name = this.__paras["model_name"];
        const pql_fields = objectToPQL(this.__paras['Fields'], true);
        const file_name = pluralize.plural(m_name);
        const class_name = humps.pascalize(pluralize.singular(m_name));
        const locals = { class_name, pql_fields, };
        const basePath = path.join(AppDir, '../pql/', PQLPath + "/" + file_name);
        mkdirsSync(basePath);
        const pql_arr = ['index', 'show'];
        try {
            for (let index = 0; index < pql_arr.length; index++) {
                const filename = basePath + '/' + pql_arr[index] + ".pql";
                if (!fs.existsSync(filename)) {
                    const content = await render(VIEW_NAME_PQL + pql_arr[index], locals, undefined, TEMPLATE_ROOT_PATH);
                    fs.writeFileSync(filename, content);
                    console.log(`Write file OK:${filename}`);
                }
                else {
                    throw new Error("Error: file exists:" + filename);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    async fields(Fields) {
        try {
            const m_name = this.__paras["model_name"];
            if (isString(Fields) && Fields.length > 0) {
                Fields = Fields.trim();
                if (Fields[0] === "{" && Fields[Fields.length - 1] === "}") {
                    Fields = loose_json(Fields);
                }
                else {
                    if (extname(Fields).length < 1) {
                        Fields += '.json';
                    }
                    if (Fields.indexOf('/') <= 0) {
                        Fields = require(path.join(AppDir, `../fields_define/${Fields}`));
                    }
                    else {
                        Fields = require(path.join(AppDir, Fields));
                    }
                }
            }
            else {
                Fields = require(path.join(AppDir, `../fields_define/${m_name}.json`));
            }

            const model_name = camelize(m_name) + "Model";
            let str = '';
            let ref_str = '';
            let rule_str = "";
            let rule_attributes_str = "";

            for (const key in Fields) {
                const field = Fields[key];
                str += (str === '' ? '' : ",\r\n") + "\t".repeat(3) + key + ": " + this.stringifyNotQuotes(key, field, null, 4);
                rule_attributes_str += (rule_attributes_str === '' ? '' : "\r\n") + " ".repeat(16) + `// ${key}: ctx.__('${model_name}.${key}'),`;

                const ruleArr = {};
                for (const fKey in field) {
                    const fType = fKey.toLowerCase();
                    switch (fKey) {
                        case "ref":
                            {
                                if (key.toLowerCase().endsWith("_id")) {
                                    const className = key.substring(0, key.length - 3);
                                    ref_str += (ref_str === "" ? "" : "\r\n") + " ".repeat(8) + `this.belongsTo('${pluralize.plural(key.substring(0, key.length - 3))}');`
                                    ruleArr[fKey] = `exists:${pluralize.plural(className)},_id`;
                                }
                                break;
                            }
                        case "required":
                            {
                                ruleArr[fKey] = `required`;
                                break;
                            }
                        case "type":
                            {
                                if (fType === "string" || fType === "boolean" || fType === 'date') {
                                    ruleArr[fKey] = fType;
                                } else if (fType === "number") {
                                    ruleArr[fKey] = "numeric";

                                } else if (fType === "array" || fType[0] === '[') {
                                    ruleArr[fKey] = "array";
                                }
                                else {
                                    ruleArr[fKey] = "string";
                                }
                                break;
                            }
                        case "unique":
                            {
                                if (key.toLowerCase().endsWith("_id")) {
                                    const className = key.substring(0, key.length - 3);
                                    ruleArr[fKey] = `unique:${pluralize.plural(className)},key`;
                                }
                                break;
                            }
                    }
                }

                const attr = [];
                for (const key in ruleArr) {
                    attr.push(ruleArr[key]);
                }
                if (attr.length === 0) {
                    attr.push("string");
                }

                rule_str += (rule_str === '' ? '' : "\r\n") + " ".repeat(16) + `// ${key}: '${attr.join("|")}',`;
            }
            this.__paras['Fields'] = Fields;
            this.__paras['Fields_str'] = str;
            this.__paras['Fields_ref_str'] = ref_str;
            this.__paras['Fields_rule_str'] = rule_str;
            this.__paras['Fields_rule_attributes_str'] = rule_attributes_str;
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
            const PQLPath = 'public/' + AllPath;
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
            await this.create_pql(PQLPath);
        }
        catch (error) {
            console.error("Error:" + error.message);
        }
    }

    async create_adminbro(chinese_collection_name_info) {
        let [chinese_collection_name, languages] = chinese_collection_name_info.split(",");
        if (!languages) { languages = "zh-CN|en"; }
        const m_name = this.__paras["model_name"];
        const file_name = pluralize.plural(m_name);
        const model_class = humps.pascalize(pluralize.singular(m_name)) + "Model";
        const object_name = humps.pascalize(pluralize.plural(file_name));
        const en_collection_name = humps.decamelize(object_name, { separator: ' ' });
        const model_dir = path.join(AppDir, `./adminbro/resources/${model_class}`);
        const write_model_file = model_dir + "/index.js";
        const model_dir_index_file = path.join(AppDir, `./adminbro/resources/index.js`);

        const { fields_str, fields_list_str } = this.adminbro_fields_str(model_class);
        const locals = { model_class, en_collection_name, object_name, m_name, fields_str, fields_list_str };

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

            const language_arr = languages.split('|');
            const lang_count = language_arr.length;
            for (let index = 0; index < lang_count; index++) {
                const language = language_arr[index].trim();
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
                        const collection_name = language.startsWith('zh') ? chinese_collection_name : en_collection_name;
                        const addContent = `"${en_collection_name}": "${collection_name}",\r\n${prefix}`;

                        const content_arr = content.split(finds[0]);
                        if (content_arr[1]) {
                            const ends = content_arr[1].match(/(([\s]*?)\}([,\s]*?))([\r\n\s]*?}[;\s\r\n]*?$)/);
                            if (ends.length === 5) {
                                let comma = ends[3].trim();
                                if (comma.length <= 0) { comma = ','; }
                                else if (comma === ',') { comma = ""; }
                                const start_str = (ends[2].startsWith("\r\n") ? '' : "\r\n") + ends[2];
                                content_arr[1] = content_arr[1].split(ends[4])[0]
                                    + comma
                                    + start_str
                                    + model_class + ": {\r\n"
                                    + this.getLangString(language)
                                    + start_str + "}"
                                    + ends[4];
                            }
                        }
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
        }
        catch (error) {
            console.error(error);
        }
    }
}

const cmd = new ModelCommand();
cmd.run();