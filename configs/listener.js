//对象默认在src/listeners目录下，也可以通过 ../来使用其他目录下文件
module.exports = {
    //事件类型: 对应处理方法
    //可以是字符串用;分割或数组
    //如果想要指定只使用事件的话，请在文件名后加@后跟指定事件名称多个用,分割
    //如果想要排除指定事件只需要在事件名称前加-符号
    //如果指定事件和排除指定事件不要混合用，如果混合那么只会保留指定事件
    //如果文件只是一个函数，那么函数名默认为事件名,如果是匿名函数就自动转为统配所有事件
    "app": ["app_listener"],
    //"jwt_auth":["jwt_auth_listener"],
    "user": ["controllers/api/v1/user_auth_listener"],
    "send_sms_end": ["controllers/api/v1/send_sms_end_listener"],
    "send_sms": ["controllers/api/v1/send_sms_listener"],
    "send_email": ["controllers/api/v1/send_email_listener"],
    "send_email_end": ["controllers/api/v1/send_email_end_listener"],
    "UserController": ["controllers/api/v1/users_log_listener.js"],
    "error": ["error_listener"],
    "websocket": ["websocket/websocket_log_listener"],
};