const require2 = require('tomjs/handlers/require2');
const BaseController = require2('tomjs/controllers/base_controller');
const Events = require2('tomjs/handlers/events');

class co extends BaseController {
    constructor() {
        super();
        this.emitter = Events.getEventEmitter('show');
    }
    async index(ctx) {
        await ctx.render('index', { title:'new page title', content:'hello world!' });
    }
}
module.exports = co;