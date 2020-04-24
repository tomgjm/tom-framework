'use strict'
const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const { src_dir, database, configs } = require('./.base_templates.js');

//载入UserModel
//let UserModel = require(path.resolve(src_dir, './models/user'));

async function up() {
    let db = await database.build(); //连接数据库
    //let Users = UserModel.Model(db);
}

async function down() {
    let db = await database.build(); //连接数据库
    //let Users = UserModel.Model(db);
}

module.exports = {
    up: function(next) {
        up().then(function() { next(); }).catch(function(err) { throw err; })
    },
    down: function(next) {
        down().then(function() { next(); }).catch(function(err) { throw err; })
    }
};