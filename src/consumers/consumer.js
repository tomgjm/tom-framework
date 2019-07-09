const require2 = require('tomjs/handlers/require2');
const { allShutdown } = require2('tomjs/handlers/run_consumer');
let all_count = 0;
class Consumer {
    error(consumer, id, msg) {
        all_count++;
        console.log("error consumer:", consumer.stream,
            "group:", consumer.group,
            "consumer:", consumer.consumer,
            " id:", id,
            " msg:", msg,
            "all_count", all_count);
        if (all_count >= 10) { allShutdown(); }
    }
    my(consumer, id, msg) {
        all_count++;
        console.log("my consumer:", consumer.stream,
            " id:", id,
            " msg:", msg,
            "all_count", all_count);
        if (all_count >= 10) { allShutdown(); }
    }
    my2(consumer, id, msg) {
        all_count++;
        console.log("my consumer:", consumer.stream,
            " id:", id,
            " msg:", msg,
            "all_count", all_count);
        if (all_count >= 10) { allShutdown(); }
    }
};
module.exports = Consumer;