const require2 = require('tomjs/handlers/require2');
const validate = require2('mongoose-validator');
const extend = validate.extend;
extend(
    'isEMail',
    function isEMail(val) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(val);
    },
    'Is not E-Mail address'
);
extend(
    'isMobile',
    function isEMail(val) {
        var re = /^1\d{10}$/;
        return re.test(val);
    },
    'Is not Mobile number'
);
module.exports = validate;
