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
    if (websocket_ok) {
        var id = 0;
        var old_send = this.prototype.send;
        function send(id, method, path, data) {
            if (!isObject(data)) {
                data = {
                    data: data
                };
            }
            arguments[0] = JSON.stringify({
                id,
                method,
                path,
                data
            });
            return old_send.apply(self.prototype, arguments);
        }
        this.send = function (method, path, data) {
            return send(++id, method, path, data);
        }
        this.sendAsync = function (method, path, data, timeout) {
            return new Promise(function (resolve, reject) {
                send(++id, method, path, data);
                var timeout_handle = undefined;
                var timeout = timeout || self.timeout;
                if (timeout > 0) {
                    var fn = function () {
                        if (AsyncObj[id]) { AsyncObj[id].timeout_handle = null; }
                        reject({
                            code: -2, message: 'time out:' + timeout, data: { id: id, method: method, path: path, data: data }
                        });
                    }
                    timeout_handle = setTimeout(fn, timeout);
                }
                AsyncObj[id] = { resolve: resolve, reject: reject, timeout_handle: timeout_handle };
            })
        }

        this._onmessage = undefined;
        this.prototype.onmessage = function (evt) {
            var data = JSON.parse(evt.data);
            if (isObject(data) && data.id && AsyncObj[data.id]) {
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
                    var timeout_error = new Error('websocket time out receive');
                    timeout_error.name = "ws_time_out_receive";
                    timeout_error.data = data;
                    if (isFunction(self.onerror)) {
                        evt.error = timeout_error;
                        self.onerror(evt);
                    }
                    else { throw timeout_error; }
                }
            }
            else if (isFunction(self._onmessage)) {
                self._onmessage(evt);
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