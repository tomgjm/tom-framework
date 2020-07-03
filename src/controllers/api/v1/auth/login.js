const require2 = require('tomjs/handlers/require2');
const BaseLogin = require2('tomjs/controllers/auth/base_login');

class Login extends BaseLogin {
    async login(ctx) {
        await super.login(ctx);
    }
}
module.exports = Login
