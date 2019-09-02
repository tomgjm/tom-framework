const { toBool } = require('tomjs/handlers/base_tools');
module.exports = {
    cache_name: 'captche',
    cache_options: {
        engine: process.env.CAPTCHE_CACHE_ENGINE || 'mongo', //存储引擎
        host: process.env.CAPTCHE_CACHE_HOST || 'localhost', //主机地址
        port: process.env.CAPTCHE_CACHE_PORT || 27017, //端口
        username: process.env.CAPTCHE_CACHE_USERNAME || '',
        password: process.env.CAPTCHE_CACHE_PASSWORD || '',
        database: process.env.CAPTCHE_CACHE_DATABASE || 'test',
        collection: process.env.CAPTCHE_CACHE_COLLECTION || 'tom_captche',
        ttl: process.env.CAPTCHE_CACHE_TTL || 600, //10分钟
        compression: toBool(process.env.CAPTCHE_CACHE_COMPRESSION || false),
    },
    cache_key_length: 24,
    options: {
        size: process.env.CAPTCHE_SIZE || 6, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 1, // 干扰线条的数量
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        //background: '#cc9966',
        //width: number, // width of captcha
        //height: number, // height of captcha
        //fontSize: number, // captcha text size
        //charPreset: string, // random character preset
    },
    email_code_size: process.env.CAPTCHE_EMAIL_SIZE || 6,
    email_code_type: process.env.CAPTCHE_EMAIL_TYPE || 'Aa0', //表示字母大小写与数字 具体说明请查看 npmjs.com上的randomatic
    email_default_view: process.env.CAPTCHE_EMAIL_DEFAULT_VIEW || 'email.captcha',
    email_views: {
        register_email_captcha: 'email.register_captcha',
        resetpassword_email_captcha: 'email.resetpassword_captcha',
        forgotpassword_email_captcha: 'email.forgotpassword_captcha',
    },
    email_view_code: process.env.CAPTCHE_EMAIL_VIEW_CODE || 'code',
    mobile_code_size: process.env.CAPTCHE_MOBILE_SIZE || 6,
    mobile_code_type: process.env.CAPTCHE_MOBILE_TYPE || '0', //表示纯数字 具体说明请查看 npmjs.com上的randomatic
    mobile_default_template_id: process.env.CAPTCHE_MOBILE_DEFAULT_TEMPLATE_ID || '0',
    mobile_template_ids: {
        register_mobile_captcha: process.env.CAPTCHE_MOBILE_REGISTER_TEMPLATE_ID || '0',
        resetpassword_mobile_captcha: process.env.CAPTCHE_MOBILE_RESETPASSWORD_TEMPLATE_ID || '0',
        forgotpassword_mobile_captcha: process.env.CAPTCHE_MOBILE_FORGOTPASSWORD_TEMPLATE_ID || '0',
    },
    mobile_param_code: process.env.CAPTCHE_MOBILE_PARAM_CODE || 'code',
    mobile_gateways: process.env.CAPTCHE_MOBILE_GATEWAYS || 'aliyunsms',
};
