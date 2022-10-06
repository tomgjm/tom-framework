const require2 = require('tomjs/handlers/require2');
const __ = require2('tomjs/handlers/__');
const path = require2('path');
const AppDir = require2('tomjs/handlers/dir')();

// const uploadFeature = require('@admin-bro/upload');
// const configs = require2('tomjs/configs')();
// const SystemConfig = configs.system;
// const adminbro_cfg = configs.adminbro;
// const UploadLocalProvider = require(path.join(AppDir, './adminbro/providers/upload_local'));

const admin_roles = require(path.join(AppDir, './adminbro/handlers/roles'));
const after_emit = require(path.join(AppDir, './adminbro/handlers/after_emit'));
const {{ model_class }} = require2(path.join(AppDir, './models/{{ m_name }}'));
const {{ object_name }} = {{ model_class }}.Model();

// const { href_img, list_href_img, } = require(path.join(AppDir, './adminbro/components'));

module.exports = (parent) => {
    const properties = {
        _id: 'ID',
{{fields_str}}
        created_at: __('created_at'),
        updated_at: __('updated_at'),
    };

    // const field_name_availableValues = [];
    // for (const key in {{ model_class }}.defines.field_name) {
    //     field_name_availableValues.push({ value: {{ model_class }}.defines.field_name[key], label: __(`{{ model_class }}.${key}`) });
    // }

    return {
        resource: {{ object_name }},
        options: {
            parent,
            listProperties: ['_id', {{fields_list_str}}'created_at', 'updated_at',],
            showProperties: ['_id', {{fields_list_str}}'created_at', 'updated_at',],
            editProperties: [{{fields_list_str}}],
            filterProperties: ['_id', {{fields_list_str}}'created_at', 'updated_at',],
            properties: {
                // field_name: {
                //     isRequired: true,
                //     availableValues: field_name_availableValues,
                //     components: {
                //         list: list_href_img,
                //         show: href_img,
                //     },
                // },
            },
            actions: {
                new: {
                    isAccessible: admin_roles("{{ model_class }}", "new"),
                    after: after_emit("{{ model_class }}", "new"), 
                },
                edit: {
                    isAccessible: admin_roles("{{ model_class }}", "edit"), 
                    after: after_emit("{{ model_class }}", "edit"),
                },
                delete: {
                    isAccessible: admin_roles("{{ model_class }}", "delete"),
                    after: after_emit("{{ model_class }}", "delete"),
                },
                bulkDelete: {
                    isAccessible: admin_roles("{{ model_class }}", "bulkDelete"),
                    after: after_emit("{{ model_class }}", "bulkDelete"),
                },
                list: {
                    isAccessible: admin_roles("{{ model_class }}", "list"),
                    after: after_emit("{{ model_class }}", "list"),
                },
                show: {
                    isAccessible: admin_roles("{{ model_class }}", "show"),
                    after: after_emit("{{ model_class }}", "show"),
                },
            },
        },
        translations: {
            label: __('adminbor.{{ en_collection_name }}'),
            properties,
        },
        // features: [
        //     uploadFeature({
        //         provider: new UploadLocalProvider(SystemConfig.local_storage_bucket, path.join(AppDir, SystemConfig.local_storage_path)),
        //         properties: {
        //             key: 'file.file',
        //             mimeType: 'file.mime_type',
        //             bucket: 'file.bucket',
        //             size: 'file.size',
        //             file: 'file.filename',
        //             filePath: `file.filePath`,
        //             filesToDelete: `file.filesToDelete`,
        //         },
        //         validation: {
        //             mimeTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'],
        //             maxSize: adminbro_cfg.image_max_size,
        //         },
        //     }),
        //    uploadPath: (record, filename) => (
        //         `${record.id()}/file/${filename}`
        //    ),
        // ],
    };
};