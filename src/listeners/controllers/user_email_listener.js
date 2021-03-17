const require2 = require('tomjs/handlers/require2');
const config = require2('tomjs/configs')();
const auth_cfg = config.auth;
const users_cfg = config.users;
const BaseListener = require2('tomjs/listener/base_listener');
const moment = require2('moment');
const { getUrlDomain } = require2('tomjs/handlers/tools');

const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();

const Events = require2('tomjs/handlers/events');
let mail_emitter = Events.getEventEmitter('send_email');
const log4js = require2('tomjs/handlers/log4js');
let Log = console;
if (auth_cfg.log4js_category) {
    Log = log4js.getLogger(auth_cfg.log4js_category);
}


const AdminuserModel = require2(path.join(AppDir, './models/adminuser'));//
const AdminUsers = AdminuserModel.Model();

async function getAdmins(role) {
    const admins = await AdminUsers.findAll({ roles: { $elemMatch: { $eq: role } } });
    if (admins) {
        return admins.map(admin => admin.email);
    }
    return undefined;
}

class UserListener extends BaseListener {
    //函数名就是具体事件名称
    async register({ ctx, user, token } = {}) {
        const receivers = await getAdmins(users_cfg.send_mail_admin_role);
        if (user.toJSON) { user = user.toJSON(); }
        if (receivers) {
            mail_emitter.emit('send', {
                receivers,
                view_name: "email.register_to_admin",
                locals: Object.assign(
                    {},
                    user,
                    {
                        Time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        URL: getUrlDomain() + '/admin/resources/UserModel/records/' + user.id + '/show'
                    })
            });
        }
    }

    async update_auth({ ctx, id, old_info, new_info } = {}) {
        const receivers = await getAdmins(users_cfg.send_mail_admin_role);
        if (receivers) {
            mail_emitter.emit('send', {
                receivers,
                view_name: "email.update_auth",
                locals: Object.assign(
                    {},
                    new_info,
                    {
                        Time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        URL: getUrlDomain() + '/admin/resources/UserModel/records/' + new_info.id + '/show'
                    })
            });
        }
    }

}
module.exports = UserListener;
