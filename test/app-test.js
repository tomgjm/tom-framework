//const assert = require('assert');
const request = require('supertest');
const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const SystemConfig = require2('tomjs/configs')().system;
const startRun = require2('tomjs/app');
const { getUrlDomain } = require2('tomjs/handlers/tools');

describe('#test koa app', () => {
    let servers_obj = {};
    let WEB_HOST = getUrlDomain();
    let API_HOST = getUrlDomain() + '/api';

    console.log(`WEB_HOST: ${WEB_HOST}`, `API_HOST: ${API_HOST}`);

    it('#startRun ', async () => {
        servers_obj = await startRun();
        if (SystemConfig.server_run_type_https) {
            console.log('Now start https server on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_https_port + '...');
        }
        if (SystemConfig.server_run_type_http) {
            console.log('Now start http server on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_http_port
                + (SystemConfig.server_run_type_force_https ? (' force to https IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_https_port) : '...'));
        }
    });
    // it('#WEB 验证Web是否工作 GET /', async () => {
    //     let res = await request(WEB_HOST)
    //         .get('/')
    //         .expect('Content-Type', /html/)
    //         .expect(200, /hello world!/);
    // });
    it('#API 验证API是否工作 GET /', async () => {
        let res = await request(API_HOST)
            .get('/')
            .expect('Content-Type', /json/)
            .expect(200, /^{"code":404/);
    });

    let token_obj = undefined;
    let time_str = '' + new Date().getTime();
    let time_str_len = time_str.length;
    let user_obj = {
        name: 'test_' + time_str,
        password: '123456',
        email: time_str + '@test.com',
        mobile: '130' + time_str.substring(time_str_len - 8, time_str_len),
    };

    it(`#API 获取登陆验证配置信息 GET /v1/auth/info/`, async () => {
        let res = await request(API_HOST)
            .get(`/v1/auth/info`)
            .expect('Content-Type', /json/)
            .expect(200, /^{"code":0,/);
        let auth_cfg = res.body.data;
        describe('#API Register User', () => {
            //图形验证码
            let register_captcha = {};
            if (auth_cfg.register_captcha) {
                it(`#API 图形验证码 GET /v1/auth/captcha/${auth_cfg.register_captcha_field}`, async () => {
                    let res = await request(API_HOST)
                        .get(`/v1/auth/captcha/${auth_cfg.register_captcha_field}`)
                        .expect('Content-Type', /json/)
                        .expect(200, /^{"code":0,/);
                    register_captcha = res.body.data;
                });
            }

            //email验证码
            let email_register_captcha = {};
            if (auth_cfg.register_email) {
                it(`#API email验证码 GET /v1/auth/captcha/email/${auth_cfg.register_email_field}/${user_obj.email}`, async () => {
                    let res = await request(API_HOST)
                        .get(`/v1/auth/captcha/email/${auth_cfg.register_email_field}/${user_obj.email}`)
                        .expect('Content-Type', /json/)
                        .expect(200, /^{"code":0,/);
                    email_register_captcha = res.body.data;
                });
            }

            //mobile验证码
            let mobile_register_captcha = {};
            if (auth_cfg.register_mobile) {
                //图形验证码
                let mobile_svg_captcha = {};
                if (auth_cfg.mobile_need_captcha) {
                    it(`#API mobile验证码 图形验证码 GET /v1/auth/captcha/${auth_cfg.mobile_captcha_field}`, async () => {
                        let res = await request(API_HOST)
                            .get(`/v1/auth/captcha/${auth_cfg.mobile_captcha_field}`)
                            .expect('Content-Type', /json/)
                            .expect(200, /^{"code":0,/);
                        mobile_svg_captcha = res.body.data;
                    });
                }
                //获取手机验证码
                it(`#API mobile验证码 GET /v1/auth/captcha/mobile/${auth_cfg.register_mobile_field}/${user_obj.mobile}`, async () => {
                    let data = {};
                    data[auth_cfg.captcha_key_field] = mobile_svg_captcha.key;
                    data[auth_cfg.mobile_captcha_field] = mobile_svg_captcha.text;
                    let res = await request(API_HOST)
                        .post(`/v1/auth/captcha/mobile/${auth_cfg.register_mobile_field}/${user_obj.mobile}`)
                        .send(data)
                        .expect('Content-Type', /json/)
                        .expect(200, /^{"code":0,/);
                    mobile_register_captcha = res.body.data;
                });
            }
            it('#API POST /v1/auth/register', async () => {
                let data = {
                    name: user_obj.name,
                    password: user_obj.password,
                    password_confirmation: user_obj.password,
                }
                if (auth_cfg.register_captcha) {//图形验证码
                    data[auth_cfg.captcha_key_field] = register_captcha.key;
                    data[auth_cfg.register_captcha_field] = register_captcha.text;
                }
                if (auth_cfg.register_email) {//email验证码
                    data[auth_cfg.email_field] = user_obj.email;
                    data[auth_cfg.register_email_field] = email_register_captcha.text;
                }
                if (auth_cfg.register_mobile) {//mobile验证码
                    data[auth_cfg.mobile_field] = user_obj.mobile;
                    data[auth_cfg.register_mobile_field] = mobile_register_captcha.text;
                }
                let res = await request(API_HOST)
                    .post('/v1/auth/register')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(200, /^{"code":0,/);
            });
        });
        describe('#API Login', () => {
            let login_captcha = {};
            it('#API GET /v1/auth/captcha/login_captcha', async () => {
                let res = await request(API_HOST)
                    .get('/v1/auth/captcha/login_captcha')
                    .expect('Content-Type', /json/)
                    .expect(200, /^{"code":0,/);
                login_captcha = res.body.data;
            });
            it('#API POST /v1/auth/login', async () => {
                let res = await request(API_HOST)
                    .post('/v1/auth/login')
                    .send({
                        name: user_obj.name,
                        password: user_obj.password,
                        captcha_key: login_captcha.key,
                        login_captcha: login_captcha.text,
                        expiresin_long: true,
                    })
                    .expect('Content-Type', /json/)
                    .expect(200, /^{"code":0,/);
                token_obj = res.body.data;
            });
        });
        describe('#API Re Token', () => {
            it('#API GET /v1/auth/retoken', async () => {
                let res = await request(API_HOST)
                    .get('/v1/auth/retoken/1')
                    .set('Authorization', 'Bearer ' + token_obj.token)
                    .expect('Content-Type', /json/)
                    .expect(200, /^{"code":0,/);
                token_obj = res.body.data;
            });

        });
        describe('#API User info', () => {
            it('#API GET /v1/users', async () => {
                let res = await request(API_HOST)
                    .get('/v1/users/' + token_obj.userid)
                    .set('Authorization', 'Bearer ' + token_obj.token)
                    .expect('Content-Type', /json/)
                    .expect(200, /^{"code":0,/);
                user_obj = Object.assign({}, user_obj, res.body.data);
            });
            it('#API patch /v1/users', async () => {
                let new_user = {
                    memo: user_obj.memo + '_1',
                };
                let res = await request(API_HOST)
                    .patch('/v1/users/' + token_obj.userid)
                    .send(new_user)
                    .set('Authorization', 'Bearer ' + token_obj.token)
                    .expect('Content-Type', /json/)
                    .expect(200, /^{"code":0,/);
            });
        });
        describe('#API Re Password', () => {
            //图形验证码
            let resetpassword_captcha = {};
            if (auth_cfg.resetpassword_captcha) {
                it(`#API 图形验证码 GET /v1/auth/captcha/${auth_cfg.resetpassword_captcha_field}`, async () => {
                    let res = await request(API_HOST)
                        .get(`/v1/auth/captcha/${auth_cfg.resetpassword_captcha_field}`)
                        .expect('Content-Type', /json/)
                        .expect(200, /^{"code":0,/);
                    resetpassword_captcha = res.body.data;
                });
            }

            //email验证码
            let resetpassword_email = {};
            if (auth_cfg.resetpassword_email) {
                it(`#API email验证码 GET /v1/auth/captcha/email/${auth_cfg.resetpassword_email_field}/${user_obj.email}`, async () => {
                    let res = await request(API_HOST)
                        .get(`/v1/auth/captcha/email/${auth_cfg.resetpassword_email_field}/${user_obj.email}`)
                        .expect('Content-Type', /json/)
                        .expect(200, /^{"code":0,/);
                    resetpassword_email = res.body.data;
                });
            }

            //mobile验证码
            let resetpassword_mobile = {};
            if (auth_cfg.resetpassword_mobile) {
                //图形验证码
                let mobile_svg_captcha = {};
                if (auth_cfg.mobile_need_captcha) {
                    it(`#API mobile验证码 图形验证码 GET /v1/auth/captcha/${auth_cfg.mobile_captcha_field}`, async () => {
                        let res = await request(API_HOST)
                            .get(`/v1/auth/captcha/${auth_cfg.mobile_captcha_field}`)
                            .expect('Content-Type', /json/)
                            .expect(200, /^{"code":0,/);
                        mobile_svg_captcha = res.body.data;
                    });
                }
                //获取手机验证码
                it(`#API mobile验证码 GET /v1/auth/captcha/mobile/${auth_cfg.resetpassword_mobile_field}/${user_obj.mobile}`, async () => {
                    let data = {};
                    data[auth_cfg.captcha_key_field] = mobile_svg_captcha.key;
                    data[auth_cfg.mobile_captcha_field] = mobile_svg_captcha.text;
                    let res = await request(API_HOST)
                        .post(`/v1/auth/captcha/mobile/${auth_cfg.resetpassword_mobile_field}/${user_obj.mobile}`)
                        .send(data)
                        .expect('Content-Type', /json/)
                        .expect(200, /^{"code":0,/);
                    resetpassword_mobile = res.body.data;
                });
            }

            it('#API POST /v1/auth/resetpassword', async () => {
                let data = {
                    old_password: user_obj.password,
                    password: '654321',
                    password_confirmation: '654321',
                }
                if (auth_cfg.resetpassword_captcha) {//图形验证码
                    data[auth_cfg.captcha_key_field] = resetpassword_captcha.key;
                    data[auth_cfg.resetpassword_captcha_field] = resetpassword_captcha.text;
                }
                if (auth_cfg.resetpassword_email) {//email验证码
                    data[auth_cfg.email_field] = user_obj.email;
                    data[auth_cfg.resetpassword_email_field] = resetpassword_email.text;
                }
                if (auth_cfg.resetpassword_mobile) {//mobile验证码
                    data[auth_cfg.mobile_field] = user_obj.mobile;
                    data[auth_cfg.resetpassword_mobile_field] = resetpassword_mobile.text;
                }
                let res = await request(API_HOST)
                    .post('/v1/auth/resetpassword')
                    .set('Authorization', 'Bearer ' + token_obj.token)
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(200, /^{"code":0,/);
                token_obj.token = res.body.data.token;
            });
        });

        describe('#API Forgot Password', () => {
            //图形验证码
            let forgotpassword_captcha = {};
            if (auth_cfg.forgotpassword_captcha) {
                it(`#API 图形验证码 GET /v1/auth/captcha/${auth_cfg.forgotpassword_captcha_field}`, async () => {
                    let res = await request(API_HOST)
                        .get(`/v1/auth/captcha/${auth_cfg.forgotpassword_captcha_field}`)
                        .expect('Content-Type', /json/)
                        .expect(200, /^{"code":0,/);
                    forgotpassword_captcha = res.body.data;
                });
            }

            //email验证码
            let forgotpassword_email = {};
            if (auth_cfg.forgotpassword_email) {
                it(`#API email验证码 GET /v1/auth/captcha/email/${auth_cfg.forgotpassword_email_field}/${user_obj.email}`, async () => {
                    let res = await request(API_HOST)
                        .get(`/v1/auth/captcha/email/${auth_cfg.forgotpassword_email_field}/${user_obj.email}`)
                        .expect('Content-Type', /json/)
                        .expect(200, /^{"code":0,/);
                    forgotpassword_email = res.body.data;
                });
            }

            //mobile验证码
            let forgotpassword_mobile = {};
            if (auth_cfg.forgotpassword_mobile) {
                //图形验证码
                let mobile_svg_captcha = {};
                if (auth_cfg.mobile_need_captcha) {
                    it(`#API mobile验证码 图形验证码 GET /v1/auth/captcha/${auth_cfg.mobile_captcha_field}`, async () => {
                        let res = await request(API_HOST)
                            .get(`/v1/auth/captcha/${auth_cfg.mobile_captcha_field}`)
                            .expect('Content-Type', /json/)
                            .expect(200, /^{"code":0,/);
                        mobile_svg_captcha = res.body.data;
                    });
                }
                //获取手机验证码
                it(`#API mobile验证码 GET /v1/auth/captcha/mobile/${auth_cfg.forgotpassword_mobile_field}/${user_obj.mobile}`, async () => {
                    let data = {};
                    data[auth_cfg.captcha_key_field] = mobile_svg_captcha.key;
                    data[auth_cfg.mobile_captcha_field] = mobile_svg_captcha.text;
                    let res = await request(API_HOST)
                        .post(`/v1/auth/captcha/mobile/${auth_cfg.forgotpassword_mobile_field}/${user_obj.mobile}`)
                        .send(data)
                        .expect('Content-Type', /json/)
                        .expect(200, /^{"code":0,/);
                    forgotpassword_mobile = res.body.data;
                });
            }

            it('#API POST /v1/auth/forgotpassword', async () => {
                let data = {
                    password: '123456',
                    password_confirmation: '123456',
                }
                if (auth_cfg.forgotpassword_captcha) {//图形验证码
                    data[auth_cfg.captcha_key_field] = forgotpassword_captcha.key;
                    data[auth_cfg.forgotpassword_captcha_field] = forgotpassword_captcha.text;
                }
                if (auth_cfg.forgotpassword_email) {//email验证码
                    data[auth_cfg.email_field] = user_obj.email;
                    data[auth_cfg.forgotpassword_email_field] = forgotpassword_email.text;
                }
                if (auth_cfg.forgotpassword_mobile) {//mobile验证码
                    data[auth_cfg.mobile_field] = user_obj.mobile;
                    data[auth_cfg.forgotpassword_mobile_field] = forgotpassword_mobile.text;
                }
                let res = await request(API_HOST)
                    .post('/v1/auth/forgotpassword')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(200, /^{"code":0,/);
            });
        });

        describe('#API Logout', () => {
            it('#API GET /v1/auth/logout', async () => {
                let res = await request(API_HOST)
                    .get('/v1/auth/logout')
                    .set('Authorization', 'Bearer ' + token_obj.token)
                    .expect('Content-Type', /json/)
                    .expect(200, /^{"code":401,/);
            });
            it('#API GET /v1/auth/retoken', async () => {
                let res = await request(API_HOST)
                    .get('/v1/auth/retoken/1')
                    .set('Authorization', 'Bearer ' + token_obj.token)
                    .expect('Content-Type', /json/)
                    .expect(200, /^{"code":401,/);
                token_obj = res.body.data;
            });
            it('#API GET /v1/users', async () => {
                let res = await request(API_HOST)
                    .get('/v1/users/' + token_obj.userid)
                    .set('Authorization', 'Bearer ' + token_obj.token)
                    .expect('Content-Type', /json/)
                    .expect(200, /^{"code":401,/);
                user_obj = Object.assign({}, user_obj, res.body.data);
            });
        });
    });

});
