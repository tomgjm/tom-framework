'use strict'
const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const { src_dir, database, configs } = require('./.base_templates.js');

//载入Model
const {{ model_name }} = require(path.resolve(src_dir, './models/{{ file_name }}'));

async function up() {
    const db = await database.build(); //连接数据库
    const {{ object_name }} = {{ model_name }}.Model(db);
}

async function down() {
    const db = await database.build(); //连接数据库
    // const {{ object_name }} = {{ model_name }}.Model(db);
    const result = await db.connection.db.dropCollection({{ model_name }}.collection);
    console.log("Collection drop:" + {{ model_name }}.collection + ", OK!:", result);
}

module.exports = {
    up: function(next) {
        up().then(function() { setTimeout(next, configs.database.migrate.up_outtime); }).catch(function(err) { next(err); })
    },
    down: function(next) {
        down().then(function() { setTimeout(next, configs.database.migrate.down_outtime); }).catch(function(err) { next(err); })
    }
};