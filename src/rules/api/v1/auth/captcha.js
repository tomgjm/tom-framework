const require2 = require('tomjs/handlers/require2');
const BaseCaptchaRuls = require2('tomjs/rules/auth/base_captcha');

class CaptchaRuls extends BaseCaptchaRuls {

    constructor() {
        super();
    }
}
module.exports = CaptchaRuls;