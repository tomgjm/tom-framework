const Policy = require('./policy');
class {{ singular_name }}Policy extends Policy {
    show(ctx,model){
        return ctx.auth.id() == model.id;
    }
    edit(ctx,model){
        return ctx.auth.id() == model.id;
    }
    delete(ctx,model){
        return ctx.auth.id() == model.id;
    }
};
module.exports = new {{ singular_name }}Policy();