const require2 = require('tomjs/handlers/require2');
const { isArray, isFunction } = require('tomjs/handlers/base_tools');
const MAX_SHOW_TAB_COUNT = 6;

module.exports = class BaseCommand {
    constructor({ cmd_name, cmd_info, cmd_args, cmd_help_version_keys = ['h', 'help', 'v', 'version'], default_show_tab_count = MAX_SHOW_TAB_COUNT } = {}) {
        this.__cmd_name = cmd_name;
        this.__cmd_args = isArray(cmd_args) ? cmd_args : [];// {must:false,args:[],para,help,default,action}
        this.__cmd_info = cmd_info;
        this.__cmd_help_version_keys = cmd_help_version_keys;
        this.__have_cmd_help_version = false;
        this.__argv = require('minimist')(process.argv.slice(2));
        this.init__argv();
        this.__help_info = "";
        this.__paras = {};//所有公共参数（即：没有 -和--的裸参数）
        this.__actions = {};//参数对应函数
        this.__defaults = {};//参数默认值
        this.__default_show_tab_count = default_show_tab_count;
    }

    init__argv() {
        for (const key in this.__argv) {
            if (key != "_" && this.__argv[key] === true) {
                this.__argv[key] = null;
                if (this.__cmd_help_version_keys.includes(key)) {
                    this.__have_cmd_help_version = true;
                }
            }
        }
    }

    replaceVar(str) {
        for (const key in this.__paras) {
            str = str.replace(new RegExp("\\$\\{" + key + "\\}"), this.__paras[key]);
        }
        return str;
    }

    async run() {
        try {
            let usage = "usage: " + this.__cmd_name;
            const op_args = [];
            this.__paras = {};
            this.__actions = {};
            this.__defaults = {};
            let para_index = 0;
            this.__cmd_args.map(arg => {
                let usage_str = "";
                let op_args_str = "  ";
                if (arg.args) {
                    let boFind = false;
                    let full_name = "";
                    const action = { action: arg.action, run: false };
                    for (let index = 0; index < arg.args.length; index++) {
                        const one = arg.args[index].trim();
                        const tip = `${one}, `;
                        usage_str += tip;
                        op_args_str += tip;

                        let fnName = one;

                        if (fnName.startsWith('--')) {
                            fnName = fnName.substr(2).trim();
                        } else if (fnName.startsWith('-')) {
                            fnName = fnName.substr(1).trim();
                        }
                        if (full_name.length < fnName.length) { full_name = fnName; }

                        this.__actions[fnName] = action;

                        if (!boFind) {
                            boFind = this.__argv[fnName] === undefined ? false : true;
                            if (arg.default && this.__argv[fnName] === null && arg.action) {
                                this.__argv[fnName] = this.replaceVar(arg.default);
                            }
                            if (boFind && arg.para) {
                                this.__paras[arg.para] = this.__argv[fnName];
                            }
                        }
                    }
                    if (!boFind && arg.para && arg.default) { this.__paras[arg.para] = this.replaceVar(arg.default); }
                    if (!boFind && arg.must
                        && ((arg.action && !this.__argv[full_name]) || (!arg.action && !this.__paras[arg.para]))
                        && !this.__have_cmd_help_version
                    ) {
                        throw new Error("Must para:" + arg.para);
                    }
                } else if (arg.para) {
                    usage_str += `<${arg.para}>`;
                    op_args_str += `<${arg.para}>`;
                    if (arg.must && !this.__argv._[para_index] && !this.__have_cmd_help_version) {
                        throw new Error("Must para:" + arg.para);
                    }
                    this.__paras[arg.para] = this.__argv._[para_index];
                }
                let iTCount = this.__default_show_tab_count;
                let add_str_length = 0;
                usage_str = usage_str.trim();
                if (usage_str[usage_str.length - 1] === ',') {
                    usage_str = usage_str.substr(0, usage_str.length - 1);
                }
                op_args_str = op_args_str.trim();
                if (op_args_str[op_args_str.length - 1] === ',') {
                    op_args_str = op_args_str.substr(0, op_args_str.length - 1);
                }
                op_args_str += " ";
                if (arg.args) {
                    const str = " " + (arg.para ? `<${arg.para}> ` : "");
                    usage_str += str;
                }
                if (!arg.must) {
                    usage_str = "[ " + usage_str.trim() + " ]";
                }

                if (arg.args && arg.para) {
                    const str = `<${arg.para}>`;
                    op_args_str += str;
                    add_str_length += str.length;
                }

                if (add_str_length > 8) {
                    iTCount -= parseInt(add_str_length / 8);
                }

                if (arg.help) {
                    iTCount += (arg.show_help_tab_count === undefined ? 0 : parseInt(arg.show_help_tab_count, 10));
                    iTCount = iTCount > 0 ? iTCount : 1;
                    op_args_str += "\t".repeat(iTCount) + arg.help;
                }

                if (arg.default) {
                    op_args_str += " (default: " + this.replaceVar(arg.default) + ")";
                }

                if (usage_str.length > 0) {
                    usage += " " + usage_str;
                }
                if (op_args_str.length > 0) {
                    op_args.push(op_args_str);
                }
            });

            let out = usage + "\r\n\r\n" + this.__cmd_info + "\r\n\r\noptional arguments:\r\n";
            op_args.map(arg_str => {
                out += arg_str + "\r\n";
            });
            this.__help_info = out;

            if (isFunction(this.before)) {
                await this.before();
            }

            for (const key in this.__argv) {
                if (key != '_') {
                    const element = this.__argv[key];
                    if (this.__actions[key]) {
                        if (this.__have_cmd_help_version && !this.__cmd_help_version_keys.includes(key)) {
                            continue;
                        }
                        if (isFunction(this.__actions[key].action)) {
                            if (!this.__actions[key].run) {
                                this.__actions[key].run = true;
                                await this.__actions[key].action(element);
                            }
                        }
                        else if (isFunction(this[this.__actions[key].action])) {
                            if (!this.__actions[key].run) {
                                this.__actions[key].run = true;
                                await this[this.__actions[key].action](element);
                            }
                        }
                        if (this.__have_cmd_help_version && this.__cmd_help_version_keys.includes(key)) {
                            process.exit();
                        }
                    }
                }
            }

            if (isFunction(this.after)) {
                await this.after();
            }
        }
        catch (error) {
            console.log("Error:" + error.message);
        }
    }

    help() {
        console.log(this.__help_info);
    }
}