'use strict'
const path = require('path');
const { src_dir, database, configs } = require('./.base_templates.js');

//载入UserModel
//let UserModel = require(path.resolve(src_dir, './models/user'));

async function up() {
    let db = await database.build(); //连接数据库
    //let User = UserModel.Model(db);
}

async function down() {
    let db = await database.build(); //连接数据库
    //let User = UserModel.Model(db);
}

module.exports = {
    up: function(next) {
        up().then(function() { next(); }).catch(function(err) { throw err; })
    },
    down: function(next) {
        down().then(function() { next(); }).catch(function(err) { throw err; })
    }
};