const Policy = require('./policy');
class {{ singular_name }}Policy extends Policy {
    async show(ctx,model){
        return ctx.auth.id() == model.user_id;
    }
    async edit(ctx,model){
        return ctx.auth.id() == model.user_id;
    }
    async delete(ctx,model){
        return ctx.auth.id() == model.user_id;
    }
};
module.exports = new {{ singular_name }}Policy();