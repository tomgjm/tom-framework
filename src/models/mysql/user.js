const require2 = require('tomjs/handlers/require2');
const model = require2('tomjs/models/sequelize_model');
const Sequelize = require2('sequelize');
//const middleware = require('./middleware/user');
const configs = require2('tomjs/configs')();

class UserModel extends model {
    Init() {
        //this.collection = 'users'

        this.fillable = ['name', 'password', configs.auth.email_field, configs.auth.mobile_field];

        this.Schema = {
            name: {
                type: Sequelize.STRING(255),
                validate: {
                    notEmpty: true,
                    notNull: true,
                    len: [3, 255],
                },
                index: true,
                unique: configs.auth.unique_user_name,
            },
            password: {
                type: Sequelize.STRING(255),
                validate: {
                    notEmpty: true,
                    notNull: true,
                    len: [6, 255],
                },
            },
        };

        this.Schema[configs.auth.email_field] = {
            type: Sequelize.STRING(255),
            required: configs.auth.register_email,
            validate: {
                notEmpty: configs.auth.register_email,
                notNull: configs.auth.register_email,
                isEmail: true,
            },
            index: true,
            unique: configs.auth.register_email,
        };

        this.Schema[configs.auth.mobile_field] = {
            type: Sequelize.STRING(255),
            required: configs.auth.register_mobile,
            validate: { validator: 'isMobile' },
            index: true,
            unique: configs.auth.register_mobile,
        };

        this.tokenVersion();
        this.language();
        this.timestamps();
        this.softDeletes();
    }
    modelAfter(modelObj)
    {
        //console.log('modelAfter');
    }
}
let user = new UserModel;
//new middleware(user.BuildSchema); //引入中间件
module.exports = user;