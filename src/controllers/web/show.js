const require2 = require('tomjs/handlers/require2');
const BaseController = require2('tomjs/controllers/base_controller');

class ShowController extends BaseController {
    async index(ctx) {
        await ctx.render('index', { title:'new page title', content:'hello world!' });
    }
}
module.exports = ShowController;