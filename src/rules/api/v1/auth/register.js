const require2 = require('tomjs/handlers/require2');
const BaseRegister = require2('tomjs/rules/auth/base_register');
const { isObject } = require2('tomjs/handlers/tools');

class RegisterRules extends BaseRegister {

    constructor() {
        super();
    }

    async register(ctx) {
        let re = await super.register(ctx);
        if (isObject(re.attributes)) {
            Object.assign(re.attributes, { register_captcha: ctx.__('graph captcha') });
        } else {
            re.attributes = { register_captcha: ctx.__('graph captcha') };
        }

        return re;
    }
}
module.exports = RegisterRules;
