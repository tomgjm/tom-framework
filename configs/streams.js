const { toBool } = require('tomjs/handlers/base_tools');
const default_server_cfg = process.env.STREAMS_REDIS_DEFAULT_URL || "redis://127.0.0.1:6379/0" //"redis://:authpassword@127.0.0.1:6380/4"
module.exports = {
    type_default: 'redis',
    types: {
        redis: "tomjs/streams/redis_streams",
    },

    split: '.',//如果希望将监听类名.方法名中的.改为其他符号，请此处配置（此字符必须能正确分割类名和方法名）
    //所有未配置的监听类都采用此配置(其stream不生效)
    stream_default: {
        type: 'default',//指向type_default值
        server: default_server_cfg,
        //server 也可以如下配置
        // server:{
        //     port: 6379,          // Redis port
        //     host: '127.0.0.1',   // Redis host
        //     family: 4,           // 4 (IPv4) or 6 (IPv6)
        //     password: 'auth',
        //     db: 0
        //   },
    },
    can_stream_default: toBool(process.env.STREAMS_CAN_STREAM_DEFAULT) || false,
    can_stream_class: toBool(process.env.STREAMS_CAN_STREAM_CLASS) || false,
    streams: {
        //属性名称可以为 具体的监听类名.方法名        
        "AppListener.error": {
            server: default_server_cfg,
            stream: "AppListener.error",
            type: 'default',//指向type_default值
        },
        "MyListener.error": {
            server: default_server_cfg,
            type: 'default',//指向type_default值
        },
        "MyListener.my": {
            server: default_server_cfg,
            type: 'default',//指向type_default值
        },
        "MyListener.my2": {
            server: default_server_cfg,
            type: 'default',//指向type_default值
        }
    },
    boot_run_consumers: toBool(process.env.STREAMS_BOOT_RUN_CONSUMERS) || false,//是否自动时就开始运行
    auto_ack_by_not_false: toBool(process.env.STREAMS_AUTO_ACK_BY_NOT_FALSE) || true,//每次consumer函数处理完后如果不返回false一律自动进行ack 如果为否的话就不自动进行ack
    consumers: {
        //只能用具体streams中的事件名（监听类名.方法名） 后面跟处理此事件的文件名@方法名（如果文件只有一个方法可以省略方名）
        "MyListener.my": {
            stream: "MyListener.my",//如果没有stream值，系统会采用上级属性名称代替
            group: "group1",
            name: function(name,config){console.log(config);return name;},//如果为$uuid，系统会自动生成一个新的不重复的uuid值,也可以是一个函数，系统会执行这个函数来获取name值 并会传入 当前对象上级属性名和当前对象本身两个参数
            //func 默认在src/consumers目录下，也可以通过 ../来使用其他目录下文件
            //可以是字符串用;分割或数组
            //如果文件导出的是对象请在文件名后加@后跟指定函数名称,如果未指定就采用stream或上级属性名称代的函数名部分代替
            func: ["consumer@my"],
            server: default_server_cfg,//如果没有此项系统会去读取streams相应项
            type: 'default',//如果没有此项系统会去读取streams相应项
        },
        "MyListener.my2": {
            group: "group1",
            name: "$uuid",
            func: ["consumer"],
        },
    },
};