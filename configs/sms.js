module.exports = {
    "log4js_category": process.env.SMS_LOG_CATEGORY ||"sms",
    "send_sequence": process.env.SMS_SEND_SEQUENCE || "aliyunsms",//默认采用短信网关发送顺序用,分割（遇到发送失败，自动采用下一个网关尝试发送）
    "default_nation_code":process.env.SMS_NATION_CODE || "86",

    "gateways": {
        'aliyunsms': {
            "driver":"tomjs/sms/aliyunsms",
            "access_key_id": process.env.SMS_ALIYUNSMS_ACCESS_KEY_ID || "",// ACCESS_KEY_ID 根据实际申请的账号信息进行替换
            "secret_access_key": process.env.SMS_ALIYUNSMS_SECRET_ACCESS_KEY || "",// ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
            "sign_name": process.env.SMS_ALIYUNSMS_SIGN_NAME || "",//签名
            "queue_name":process.env.SMS_ALIYUNSMS_QUEUE_NAME || "",//在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
        },
        "qcloudsms": {
            "driver":"tomjs/sms/qcloudsms",
            "app_id": process.env.SMS_QCLOUDSMS_APP_ID || "1400095968",// SDK AppID是1400开头
            "app_key": process.env.SMS_QCLOUDSMS_APP_KEY || "ea68ce42716cf39e4c3562cc7de5aeed",// 短信应用SDK AppKey
            "sign_name": process.env.SMS_QCLOUDSMS_SIGN_NAME || "CellLink链游大赛",//签名
            "sms_type":process.env.SMS_QCLOUDSMS_SMS_TYPE || 0,// Enum{0: 普通短信, 1: 营销短信}
        },
    },
};
