const require2 = require('tomjs/handlers/require2');
const KoaRouter = require2('koa-router');
const MainRouter = require2('tomjs/router/main-router');


let api_v1 = new MainRouter();

api_v1.auth();//api_v1对象所有路径默认开启jwt验证 想要不用某个指定路由不要验证 使用第三参数 {auth:false}, auth为true就是要求开启jwt验证
api_v1.authRoutes('api/v1/auth');
api_v1.get('/users/lang/', 'api/v1/users@getLang');
api_v1.get('/users/lang/:lang', 'api/v1/users@setLang');
api_v1.resource('/users/', 'api/v1/users', { name: 'users' });

// let api_v2 = new MainRouter();
// api_v2.resource('/users/', 'api/v2/users', {'only': 'index,show'});

let routers = new KoaRouter();
routers.use('/v1', api_v1.routes(), api_v1.allowedMethods())
//    .use('/v2', api_v2.routes(), api_v2.allowedMethods())
module.exports = routers;