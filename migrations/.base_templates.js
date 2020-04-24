'use strict'
const require2 = require('tomjs/handlers/require2');
const src_dir = require2('tomjs/handlers/dir')();
const configs = require2('tomjs/configs')();
const database = require2('tomjs/database');

module.exports = { src_dir, database, configs };