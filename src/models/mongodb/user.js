const require2 = require('tomjs/handlers/require2');
const model = require2('tomjs/models/mongoose_model');
//const middleware = require('./middleware/user');
const validate = require('./validate');
const configs = require2('tomjs/configs')();

class UserModel extends model {
    Init() {
        //this.collection = 'users'

        this.fillable = ['name', 'memo', configs.auth.email_field, configs.auth.mobile_field];
        this.guarded = ['password'];

        this.Schema = {
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 255,
                index: true,
                unique: configs.auth.unique_user_name,
            },
            password: {
                type: String,
                required: true,
                minlength: 6,
                maxlength: 255,
                hideJSON: true,
            },
            status:{
                type: Number,
                required: true,
                default: 1,
            },
            memo: {
                type: String,
            },
        };

        this.Schema[configs.auth.email_field] = {
            type: String,
            required: configs.auth.register_email,
            validate: validate({ validator: 'isEMail' }),
            index: true,
            unique: configs.auth.register_email,
        };

        this.Schema[configs.auth.mobile_field] = {
            type: String,
            required: configs.auth.register_mobile,
            validate: validate({ validator: 'isMobile' }),
            index: true,
            unique: configs.auth.register_mobile,
        };

        this.defines = {
            status: {
                lock: 0,
                ok: 1,
            },
        };

        this.tokenVersion();
        this.language();
        this.timestamps();
        this.softDeletes();
    }
    modelAfter(modelObj) {
        //console.log('modelAfter');
    }
}
let user = new UserModel;
//new middleware(user.BuildSchema); //引入中间件
module.exports = user;