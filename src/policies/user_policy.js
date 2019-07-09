const Policy = require('./policy');
class UserPolicy extends Policy {
    show(ctx,model){
        return ctx.auth.id() == model.id;
    }
};
module.exports = new UserPolicy();