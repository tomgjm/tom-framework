const require2 = require('tomjs/handlers/require2');
const Validator = require2('tomjs/validator');
//在此处可以添加自定义验证码规则
// Validator.registerAsync('captcha',async function(value, attribute, value_name, passes) {
//     let key = value_name+':'+attribute;
//     let Re = await cache.get(key)===value.toLowerCase();
//     await cache.del(key);
//     if (Re) { passes(); } else { passes(false); } // if username is not available
//   });

module.exports = Validator
