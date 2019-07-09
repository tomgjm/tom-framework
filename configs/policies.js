module.exports = {
    search: {
        enabled: true,
        paths:['./policies/'],//搜索起始目录 可以数组 或 字符串以,分割
        type: -1,//-1:全部尝试,0:不变动,1:decamelize(foo_bar下划线分割),2:pascalize(HelloWorld 驼峰首字母大写),3:camelize(helloWorld 驼峰首字母小写)
        pluralize: -1,//-1全部,0:不变动,1:单数,2:复数形式
        end_add: ['','Policy','_policy'],//尝试添加后缀搜索 可以数组 或 字符串以,分割
    },
};
