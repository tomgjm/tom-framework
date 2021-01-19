const require2 = require('tomjs/handlers/require2');
const BaseCron = require2('tomjs/crons/base_cron');

module.exports = class test extends BaseCron {
    test() {
        console.log("crons test class")
    }

    test2() {
        console.log("crons test2 class")
    }
}
