const { join } = require('path');
const appDir = require('tomjs/handlers/dir')();

module.exports = {
    path: join(appDir, (process.env.VIEWS_PATH || 'views')), //视图模板目录
    extension: process.env.VIEWS_PATH || 'swig',
    options: {},
    map: {'swig':'twig'},
};