const require2 = require('tomjs/handlers/require2');
const BasePassword = require2('tomjs/rules/auth/base_password');

class Password extends BasePassword {

    constructor() {
        super();
    }
}
module.exports = Password;