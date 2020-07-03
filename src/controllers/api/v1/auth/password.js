const require2 = require('tomjs/handlers/require2');
const BasePassword = require2('tomjs/controllers/auth/base_password');

class Passwor extends BasePassword {
    async resetpassword(ctx) {
        await super.resetpassword(ctx);
    }
}
module.exports = Passwor
