const require2 = require('tomjs/handlers/require2');
const BaseLogin = require2('tomjs/rules/auth/base_login');

class LoginRules extends BaseLogin {

    constructor() {
        super();
    }
}
module.exports = LoginRules;