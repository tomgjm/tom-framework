const require2 = require('tomjs/handlers/require2');
const auth_cfg = require2('tomjs/configs')().auth;
const captcha = require2('tomjs/handlers/captcha');
const captcha_email = require2('tomjs/handlers/captcha_email');
const captcha_mobile = require2('tomjs/handlers/captcha_mobile');
class Captcha {
    async index(ctx, field_name) {
        ctx.body = await captcha(field_name);
        return true;
    }
    async email(ctx, field_name, email) {
        ctx.body = await captcha_email(field_name, auth_cfg.email_field, email);
        return true;
    }
    async mobile(ctx, field_name, phoneNumber) {
        ctx.body = await captcha_mobile(field_name, auth_cfg.mobile_field, phoneNumber);
        return true;
    }
}
module.exports = Captcha
