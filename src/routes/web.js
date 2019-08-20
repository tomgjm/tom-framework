const require2 = require('tomjs/handlers/require2');
const MainRouter = require2('tomjs/router/main-router');

let web = new MainRouter();

web.get('/', 'web/show@index');

module.exports = web;