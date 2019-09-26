const require2 = require('tomjs/handlers/require2');
const log_cfg = require2('tomjs/configs')().log;
module.exports = async function (ws, isWSS) {
    if (log_cfg.show_init_info) {console.log('init ' + (isWSS ? 'ws' : 'ws')+ ' server');}
    return ws;
}