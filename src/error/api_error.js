const require2 = require('tomjs/handlers/require2');
const BaseApiError = require2('tomjs/error/base_api_error');
class ApiError extends BaseApiError {
    constructor(error_code, error_msg, data) {
        super(error_code, error_msg, data);
        this.name = "ApiError";
    }
    
    getMessage(code) {
        let message = '';
        switch (code) {
            case ApiError.MOVE_USER_AVATAR_ERROR:
                message = 'MOVE_USER_AVATAR_ERROR';
                break;
            default:
                message = super.getMessage(code);
                break;
        }
        return message;
    }
}
ApiError.MOVE_USER_AVATAR_ERROR = 2001;//用户通过POST上传头像文件系统将移动到 配置文件users.js中avatar_path指定文件夹时发生错误
module.exports = ApiError;
