//const assert = require('assert');
const request = require('supertest');
const require2 = require('tomjs/handlers/require2');//可以开始使用require2引入模块了
const SystemConfig = require2('tomjs/configs')().system;
const startRun = require2('tomjs/app');
const { getUrlDomain } = require2('tomjs/handlers/tools');

describe('#test koa app', () => {
    let obj = {};
    let WEB_HOST = getUrlDomain();
    let API_HOST = getUrlDomain('api');

    console.log(`WEB_HOST: ${WEB_HOST}`, `API_HOST: ${API_HOST}`);

    it('#startRun ', async () => {
        obj = await startRun();
        if (SystemConfig.server_run_type_https) {
            console.log('Now start https server on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_https_port + '...');
        }
        if (SystemConfig.server_run_type_http) {
            console.log('Now start http server on IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_http_port
                + (SystemConfig.server_run_type_force_https ? (' force to https IP:' + SystemConfig.server_bind_ip + ':' + SystemConfig.server_https_port) : '...'));
        }
    });
    it('#WEB GET /', async () => {
        let res = await request(WEB_HOST)
            .get('/')
            //.get('/?name=Manny&species=cat')
            //.send({ name: 'Manny', species: 'cat' })
            .expect('Content-Type', /html/)
            .expect(200, /hello world!/);
    });
    it('#API GET /', async () => {
        let res = await request(API_HOST)
            .get('/')
            .expect('Content-Type', /json/)
            .expect(200, /^{"code":401/);
    });

    let token_obj = undefined;
    let user_obj = undefined;
    describe('#API Login', () => {
        let login_captcha = {};
        it('#API GET /v1/auth/captcha/login_captcha', async () => {
            let res = await request(API_HOST)
                .get('/v1/auth/captcha/login_captcha')
                .expect('Content-Type', /json/)
                .expect(200, /^{"code":0,/);
            login_captcha = res.body.data;
            //console.log(`register captcha text: ${login_captcha.text}, key: ${login_captcha.key}`);
        });
        it('#API POST /v1/auth/login', async () => {
            let res = await request(API_HOST)
                .post('/v1/auth/login')
                .send({
                    name: 'gjm',
                    password: '123456',
                    captcha_key: login_captcha.key,
                    login_captcha: login_captcha.text,
                    expiresin_long: true,
                })
                .expect('Content-Type', /json/)
                .expect(200, /^{"code":0,/);
            token_obj = res.body.data;
            //console.log(token_obj);
        });
    });
    describe('#API User info', () => {
        it('#API GET /v1/users', async () => {
            let res = await request(API_HOST)
                .get('/v1/users/' + token_obj.userid)
                .set('Authorization', 'Bearer ' + token_obj.token)
                .expect('Content-Type', /json/)
                .expect(200, /^{"code":0,/);
            user_obj = res.body.data;
            console.log(user_obj);
            //console.log(`register captcha text: ${login_captcha.text}, key: ${login_captcha.key}`);
        });
        it('#API patch /v1/users', async () => {
            let new_user = {
                memo: user_obj.memo+'_1',
            };
            let res = await request(API_HOST)
                .patch('/v1/users/' + token_obj.userid)
                .send(new_user)
                .set('Authorization', 'Bearer ' + token_obj.token)
                .expect('Content-Type', /json/)
                .expect(200, /^{"code":0,/);
            console.log(res.body.data);
            //console.log(`register captcha text: ${login_captcha.text}, key: ${login_captcha.key}`);
        });
    });
});
