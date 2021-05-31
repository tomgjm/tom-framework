const Policy = require('./policy');
class {{ singular_name }}Policy extends Policy {
    show(ctx,model){
        return ctx.auth.id() == model.user_id;
    }
    edit(ctx,model){
        return ctx.auth.id() == model.user_id;
    }
    delete(ctx,model){
        return ctx.auth.id() == model.user_id;
    }
};
module.exports = new {{ singular_name }}Policy();