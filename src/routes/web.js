const require2 = require('tomjs/handlers/require2');
const MainRoutes = require2('tomjs/route/main-routes');

let web = new MainRoutes();

web.get('/', 'web/show@index');

module.exports = web;