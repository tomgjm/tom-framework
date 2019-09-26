const require2 = require('tomjs/handlers/require2');
const log_cfg = require2('tomjs/configs')().log;
module.exports = async function(app) {
    if (log_cfg.show_init_info) {console.log('init web server');}
    return app;
}