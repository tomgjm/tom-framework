'use strict'
const require2 = require('tomjs/handlers/require2');
const path = require2('path');
const { src_dir, database, configs } = require('./.base_templates.js');

//载入Model
const {{ model_name }} = require(path.resolve(src_dir, './models/{{ file_name }}'));

//写入文件需要的类
const SystemConfig = configs.system;
// const auth_cfg = configs.auth;
const UploadLocalProvider = require(path.join(src_dir, './adminbro/providers/upload_local'));// 上传本地文件提供器
const fs = require('fs');
const ToolsHandler = require(path.join(src_dir, './handlers/tools_handler'));

function getTypeStr(type = 0) {
    switch (type) {
        case 0:
            return 'map';
        case 1:
            return 'room';
        case 2:
            return 'goods';
        default:
            return 'map';
    }
}

const Global_Data = {
    name: "{{ data_name }}",
    max_children_weight: 0,
    goods_weight: 1,
    show_goods_move_forward: 2000,
    model_attribute: {
        skybox: "dream/skybox/skybox.jpg",
        scale: 1,
        physics: "map",
        toon: false,
        castShadow: false,
        receiveShadow: false,
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        radius: 100,
    },
    out_lines: {
        min_x: 0,
        min_y: 0,
        min_z: 0,
        max_x: 0,
        max_y: 0,
        max_z: 0,
    },
    type: 0,// 0:map 1:room 2:goods
    only_server_point: false,
    born_point: [],
    jump_point: [],
    reward_point: [],
    audio_point: [],
};// 这里可以传入多个数据对象，用于批量插入

async function up() {
    const db = await database.build(); //连接数据库
    const {{ object_name }} = {{ model_name }}.Model(db);

    const uploadObj = new UploadLocalProvider(SystemConfig.local_storage_bucket, path.join(src_dir, SystemConfig.local_storage_path));// 实例化上传本地文件提供器

    const file_dir = path.parse(__filename).name;//图片存放目录(自动根据当前文件名生成[排除扩展名])

    const { session, opts } = await ToolsHandler.getStartSession();//启动事物
    try {
        const data = Global_Data;
        const row = (await {{ object_name }}.create([data], opts))[0];

        const buildThumbnailKey = (id, filename) => `${id}/thumbnail/${filename}`;//根据adminbro中 uploadPath 定义来写这个函数
        const file_thumbnail = { path: path.resolve(src_dir, `../migrations_files/${file_dir}/thumbnail.webp`) };
        const key_thumbnail = buildThumbnailKey(row.id, path.basename(file_thumbnail.path));
        await uploadObj.upload(file_thumbnail, key_thumbnail, undefined, false);//最后一个false参数表示不删除源图片文件
        const fs_stat = fs.statSync(file_thumbnail.path);//获取文件的大小信息
        const thumbnail = {
            "file": key_thumbnail,
            "size": '' + fs_stat.size,
            "bucket": SystemConfig.local_storage_bucket,
            "mime_type": "image/webp"//这里是图片文件 如果 glb 文件，mime_type值就为: "application/octet-stream";如果 webp 文件，mime_type值就为: "image/webp"
        };

        // const buildPictureKey = (id, filename) => `${id}/picture/${filename}`;//根据adminbro中 uploadPath 定义来写这个函数
        // const file_picture = { path: path.resolve(src_dir, `../migrations_files/${file_dir}/thumbnail.webp`) };
        // const key_picture = buildPictureKey(row.id, path.basename(file_picture.path));
        // await uploadObj.upload(file_picture, key_picture, undefined, false);//最后一个false参数表示不删除源图片文件
        // const fs_picture_stat = fs.statSync(file_picture.path);//获取文件的大小信息
        // const picture = {
        //     "file": key_picture,
        //     "size": '' + fs_picture_stat.size,
        //     "bucket": SystemConfig.local_storage_bucket,
        //     "mime_type": "image/webp"//这里是图片文件 如果 glb 文件，mime_type值就为: "application/octet-stream";如果 webp 文件，mime_type值就为: "image/webp"
        // };

        // const buildMapKey = (id, filename) => `${id}/${filename}`;//根据adminbro中 uploadPath 定义来写这个函数
        // const file_map = { path: path.resolve(src_dir, `../migrations_files/${file_dir}/${getTypeStr(data['type'])}.glb`) };
        // const key_map = buildMapKey(row.id, path.basename(file_map.path));
        // await uploadObj.upload(file_map, key_map, undefined, false);//最后一个false参数表示不删除源图片文件
        // const fs_map_stat = fs.statSync(file_map.path);//获取文件的大小信息
        // const map = {
        //     "file": key_map,
        //     "size": '' + fs_map_stat.size,
        //     "bucket": SystemConfig.local_storage_bucket,
        //     "mime_type": "application/octet-stream"//这里是图片文件 如果 glb 文件，mime_type值就为: "application/octet-stream";如果 webp 文件，mime_type值就为: "image/webp"
        // };

        await ArtworkFiles.updateOne({ _id: row.id },
            {
                $set: {
                    thumbnail,
                    // picture,
                    // file: map,
                }
            }, opts);
        await row.save();

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        console.error(error);
    }
    finally {
        await session.endSession();
    }
}

async function down() {
    const db = await database.build(); //连接数据库
    const {{ object_name }} = {{ model_name }}.Model(db);
    const { session, opts } = await ToolsHandler.getStartSession();//启动事物
    try {        
        const data = Global_Data;
        const result = await {{ object_name }}.deleteOne({ name: data.name }, opts);
        if(!result.acknowledged || result.deletedCount != 1){
            console.log(`Error remove: ${data.name}, result: ${result}`, result);
            await session.abortTransaction();
        }
        else{
            console.log(`OK remove: ${data.name}, result: ${result}`, result);
            await session.commitTransaction();
        }
    } catch (error) {
        await session.abortTransaction();
        console.error(error);
    }
    finally {
        await session.endSession();
    }
}

module.exports = {
    up: function(next) {
        up().then(function() { setTimeout(next, configs.database.migrate.up_outtime_short); }).catch(function(err) { next(err); })
    },
    down: function(next) {
        down().then(function() { setTimeout(next, configs.database.migrate.down_outtime_short); }).catch(function(err) { next(err); })
    }
};