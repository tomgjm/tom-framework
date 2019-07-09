//可以定义不同队列的配置
module.exports = {
    default: { //默认队列配置
        concurrency: 1, //并发限制
        autoStart: true, //是否在并发限制内排队任务，一旦添加就会自动执行。
        //queueClass, 此参数可以自定义类 可以现更复杂的调度策略 具体查看 https://github.com/sindresorhus/p-queue#custom-queueclass
        //intervalCap:Infinity, 给定时间间隔内的最大运行次数。最小值：1
        interval: 0, //间隔计数重置之前的时间长度（以毫秒为单位）。
        carryoverConcurrencyCount: false, //任务是否必须在给定的时间间隔内完成，或者是否会延续到下一个时间间隔内。
    },
    sms_send: { //默认队列配置
        concurrency: 1, //并发限制
        autoStart: true, //是否在并发限制内排队任务，一旦添加就会自动执行。
        //queueClass, 此参数可以自定义类 可以现更复杂的调度策略 具体查看 https://github.com/sindresorhus/p-queue#custom-queueclass
        //intervalCap:Infinity, 给定时间间隔内的最大运行次数。最小值：1
        interval: 0, //间隔计数重置之前的时间长度（以毫秒为单位）。
        carryoverConcurrencyCount: false, //任务是否必须在给定的时间间隔内完成，或者是否会延续到下一个时间间隔内。
    },
};
