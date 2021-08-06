const path = require('path');
const app_dir = require('tomjs/handlers/dir')();
const { toBool } = require('tomjs/handlers/base_tools');
const system_cfg = require('./system');

// 用户认证配置
module.exports = {
    log4js_category: process.env.AUTH_LOG_CATEGORY || "user",

    jwt_secret: (process.env.JWT_SECRET ? path.join(app_dir, '../keys/', process.env.JWT_SECRET) : undefined) || path.join(app_dir, '../keys/publicKey.pub'), // jwt需要的Key文件名
    jwt_expiresin: process.env.JWT_EXPIRESIN || '2h', // jwt有效时间
    jwt_expiresin_long: process.env.JWT_EXPIRESIN_LONG || '3d',
    jwt_notBefore: process.env.JWT_NOTBEFORE,
    jwt_audience: process.env.JWT_AUDIENCE,
    jwt_issuer: process.env.JWT_ISSUER || (system_cfg.server_url_type + system_cfg.server_host),
    jwt_key: 'user',
    jwt_key_id: 'id',
    jwt_key_status: 'status',
    jwt_key_status_pass_values: [1],
    jwt_key_token_version: 'token_version',
    jwt_key_check_token_version: toBool(process.env.JWT_KEY_CHECK_TOKEN_VERSION || false),
    jwt_key_exp_is_long: 'exp_is_long',
    jwt_tokenkey: 'tokenkey',
    jwt_cookie: process.env.JWT_COOKIE || '__tomjs_tokenkey__',
    jwt_rewirte_cookie: toBool(process.env.JWT_REWIRTE_COOKIE || false),
    jwt_rewirte_cookie_remaining: process.env.JWT_REWIRTE_COOKIE_REMAINING || '30m',// 表示当过期时间还剩时间此时间，那么将重新产生新的token并写入cookie
    jwt_rewirte_cookie_remaining_long: process.env.JWT_REWIRTE_COOKIE_REMAINING_LONG || '1d',// 表示当过期时间还剩时间此时间，那么将重新产生新的token并写入cookie

    auth_routes_use_ratelimit: toBool(process.env.AUTH_ROUTES_USE_RATELIMIT || true),

    password_tpye: 'pbkdf2',// 可以是 pbkdf2 或 bcrypt,需要npm 安装 bcrypt ,切换密码加密方式不会影响解密，密码解密会自动判断解密方式
    password_salt_length: 8,
    password_digest: 'sha512',

    auth_model: path.join(app_dir, './models/user'),

    expiresin_long: 'expiresin_long', //如果登陆和注册时有此字段并且这个字段值为1 系统就会返回 jwt_expiresin_long 的 jwt,以便模拟“记住我”效果
    email_field: 'email', //email字段名
    mobile_field: 'mobile', //手机字段名

    captcha_key_field: 'captcha_key', //图像验证码对应Cache Key的字段

    mobile_need_captcha: toBool(process.env.CAPTCHA_MOBILE_NEED_CAPTCHA || true),//发送短信是否需要的图像验证码
    mobile_captcha_field: 'mobile_captcha', //发送短信需要的验证码字段

    login_username_fields: process.env.LOGIN_USERNAME_FIELDS || 'name',
    unique_user_name: toBool(process.env.UNIQUE_USER_NAME || true),

    register_name_email_mobile_lower_case: true,
    not_exists_field_head: 'register_',//以此开头的验证变量名,就表示必须在数据库内不能重复 主要用于注册
    register_captcha: toBool(process.env.REGISTER_CAPTCHA || false),
    register_captcha_field: 'register_captcha', //存放注册图像验证码内容的字段名
    register_email: toBool(process.env.REGISTER_CAPTCHA_EMAIL || true),
    register_email_field: 'register_email_captcha', //存放注册EMail验证码内容的字段名
    register_mobile: toBool(process.env.REGISTER_CAPTCHA_MOBILE || true),
    register_mobile_field: 'register_mobile_captcha', //存放注册手机验证码内容的字段名

    login_captcha: toBool(process.env.LOGIN_CAPTCHA || true),
    login_captcha_field: 'login_captcha', //存放登录图像验证码内容的字段名

    resetpassword_captcha: toBool(process.env.RESETPASSWORD_CAPTCHA || true),
    resetpassword_captcha_field: 'resetpassword_captcha', //存放注册图像验证码内容的字段名
    resetpassword_email: toBool(process.env.RESETPASSWORD_CAPTCHA_EMAIL || false),
    resetpassword_email_field: 'resetpassword_email_captcha', //存放注册EMail验证码内容的字段名
    resetpassword_mobile: toBool(process.env.RESETPASSWORD_CAPTCHA_MOBILE || false),
    resetpassword_mobile_field: 'resetpassword_mobile_captcha', //存放注册手机验证码内容的字段名

    forgotpassword_captcha: toBool(process.env.FORGOTPASSWORD_CAPTCHA || false),
    forgotpassword_captcha_field: 'forgotpassword_captcha', //存放注册图像验证码内容的字段名
    forgotpassword_email: toBool(process.env.FORGOTPASSWORD_CAPTCHA_EMAIL || false),
    forgotpassword_email_field: 'forgotpassword_email_captcha', //存放注册EMail验证码内容的字段名
    forgotpassword_mobile: toBool(process.env.FORGOTPASSWORD_CAPTCHA_MOBILE || false),
    forgotpassword_mobile_field: 'forgotpassword_mobile_captcha', //存放注册手机验证码内容的字段名
};