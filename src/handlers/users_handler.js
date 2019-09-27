const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();
const ApiError = require2(path.join(AppDir, './error/api_error'));
const Events = require2('tomjs/handlers/events');
const { renameFile, getUrlDomain } = require2('tomjs/handlers/tools');
const SystemConfig = require2('tomjs/configs')().system;
const users_cfg = require2('tomjs/configs')().users;

class UsersHandler {
    static async avatar(user_id, request_files_avatar_path) {
        let emitter = Events.getEventEmitter('user');
        let filename = user_id + path.extname(request_files_avatar_path);
        let avatar_filename = path.resolve(AppDir, users_cfg.avatar_path, filename);
        try { await renameFile(request_files_avatar_path, avatar_filename); }
        catch (e) { throw new ApiError(ApiError.MOVE_USER_AVATAR_ERROR, { id: id }); }

        let avatar_url = getUrlDomain(false) + '/avatar/' + filename;
        emitter.emit('update_avatar', { user_id, avatar_filename, avatar_url });
        return avatar_url;
    }
}
module.exports = UsersHandler;