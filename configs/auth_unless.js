module.exports = {
    web: {
        path: [
            /^\/api\/v[0-9]\/auth\/info/,
            /^\/api\/v[0-9]\/auth\/captcha/,
            /^\/api\/v[0-9]\/auth\/login/,
            /^\/api\/v[0-9]\/auth\/register/,
            /^\/api\/v[0-9]\/auth\/forgotpassword/,
        ]
    },
    websocket: {
        path: [/^\/test/,]
    }
};