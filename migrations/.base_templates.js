'use strict'
const path = require('path');
const src_dir = path.resolve(__dirname, '../src');
const AppDir = require('tomjs/handlers/dir');
AppDir(src_dir); //一定要第一时间设置系统根目录
const configs = require('tomjs/configs')();
const database = require('tomjs/database');

module.exports = { src_dir, database, configs };