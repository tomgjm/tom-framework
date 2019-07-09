const require2 = require('tomjs/handlers/require2');
const BaseRegister = require2('tomjs/controllers/auth/base_register');

class Register extends BaseRegister {
    async register(ctx) {
       await super.register(ctx)
    }
}
module.exports = Register
