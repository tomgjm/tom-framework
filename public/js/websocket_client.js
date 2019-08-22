var WEBSOCKET_ID_HEAD = 'c';

function isObject(obj) {
    return (typeof (obj) == "object") && (!Array.isArray(obj) && obj !== null);
}
function isFunction(func) {
    return typeof (func) == "function";
}
function isNumber(num) {
    return typeof (num) == "number";
}

//timeout 单位毫秒
function websocket(url, token, timeout) {
    var self = this;
    if ((timeout === undefined) && isNumber(token)) {
        timeout = token;
        token = undefined;
    }
    if (token) {
        url += (url.indexOf('?') < 0 ? '?' : '&') + 'Authorization=Bearer%20' + token;
    }
    this.timeout = timeout ? timeout : 0;
    this.url = url;
    var websocket_ok = false;
    var AsyncObj = {};
    if (window.WebSocket) {
        this.prototype = new WebSocket(url);
        websocket_ok = true;
    }
    if (window.MozWebSocket) {
        this.prototype = new MozWebSocket(url);
        websocket_ok = true;
    }

    function CreateError(evt, err_msg, err_name, data) {
        var new_error = new Error(err_msg);
        new_error.name = err_name;
        new_error.data = data;
        if (isFunction(self.onerror)) {
            evt.error = new_error;
            self.onerror(evt);
        }
        else { throw new_error; }
    }

    if (websocket_ok) {
        var iSendID = 0;
        function getNewSendID() {
            iSendID++;
            return WEBSOCKET_ID_HEAD + iSendID;
        }
        var old_send = this.prototype.send;
        function send(method, path, data, id) {
            if (data === undefined) { data = {}; }
            var obj = { code: 0, message: 'success', method: method, path: path, data: data };
            if (id) { obj.id = id; }
            arguments[0] = JSON.stringify(obj);
            return old_send.apply(self.prototype, arguments);
        }
        this.send = function (method, path, data) {
            return send(method, path, data);
        }
        this.sendAsync = function (method, path, data, timeout) {
            return new Promise(function (resolve, reject) {
                var id = getNewSendID();
                send(method, path, data, id);
                var timeout_handle = undefined;
                var time_out = timeout || self.timeout;
                if (time_out > 0) {
                    var timeout_fn = function () {
                        if (AsyncObj[id]) { AsyncObj[id].timeout_handle = null; }
                        reject({
                            code: -2, message: 'websocket time out:' + time_out, data: { id: id, method: method, path: path, data: data }
                        });
                    }
                    timeout_handle = setTimeout(timeout_fn, time_out);
                }
                AsyncObj[id] = { resolve: resolve, reject: reject, timeout_handle: timeout_handle };
            });
        }

        this.reply = function (reply_data) {
            if (self.evt) {
                var data = JSON.parse(self.evt.data);
                send(data.method, data.path, reply_data, data.id);
            }
            else {
                CreateError(self.evt, "not sever send data run reply function", "ws_rely_no_send_data", reply_data);
            }
        }

        this._onmessage = undefined;
        this.prototype.onmessage = function (evt) {
            var data = JSON.parse(evt.data);
            if (isObject(data) && data.id && (data.id.substr(0, WEBSOCKET_ID_HEAD.length) == WEBSOCKET_ID_HEAD)) {
                if (AsyncObj[data.id]) {
                    var resolve_reject = AsyncObj[data.id];
                    delete AsyncObj[data.id];

                    if (resolve_reject.timeout_handle !== null) {
                        if (resolve_reject.timeout_handle) { clearTimeout(resolve_reject.timeout_handle); }
                        if (data.code == 0) {
                            resolve_reject.resolve(data.data);
                        }
                        else {
                            resolve_reject.reject(data);
                        }
                    }
                    else {
                        //如果 resolve_reject.timeout_handle === null 表示已经超时
                        CreateError(evt, "websocket time out receive", "ws_time_out_receive", data);
                    }
                }
                else {
                    //无需回复，但客户端依旧回复的内容
                    CreateError(evt, "websocket receive error reply", "ws_receive_error_reply", data);
                }
            }
            else if (isFunction(self._onmessage)) {
                self.evt = evt;
                self._onmessage(evt);
                self.evt = undefined;
            }
        }

        Object.defineProperty(this, "onmessage", {
            get: function () {
                return _onmessage;
            },
            set: function (fn) {
                this._onmessage = fn;
            }
        });
    }
    else {
        throw new Error('init WebSocket error');
    }
}