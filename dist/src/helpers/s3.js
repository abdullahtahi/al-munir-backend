"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3 = exports.deleteFile = exports.uploadsFile = exports.bucketName = void 0;
const fs = require('fs');
const S3Client = require('aws-sdk/clients/s3');
const S3Object = new S3Client({
    region: 'ap-south-1',
    accessKeyId: 'AKIAYCAVQJL6XOII27EY',
    secretAccessKey: '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',
    signatureVersion: 'v4',
});
exports.bucketName = process.env.S3_BUCKET_NAME;
const uploadsFile = (fileName, file, folder = '', type = 'file', fileMimetype = '') => {
    return new Promise((resolve, reject) => {
        const urlParams = {
            Bucket: "al-munir",
            Key: `photos/${fileName}`,
            Body: type === 'path' ? fs.createReadStream(file) : file,
            ContentType: fileMimetype,
        };
        S3Object.upload(urlParams, function (err, data) {
            if (err) {
                resolve({ success: false, message: err.message });
                console.warn('Error uploading data: ', err);
            }
            else {
                resolve({ success: true, data, key: fileName });
            }
        });
    });
};
exports.uploadsFile = uploadsFile;
const deleteFile = async (fileKey) => {
    return new Promise((resolve, reject) => {
        const deleteParams = {
            Bucket: exports.bucketName,
            Key: fileKey.filePath,
        };
        S3Object.deleteObject(deleteParams, (err, data) => {
            if (err) {
                resolve({ success: false, message: err.stack });
            }
            else {
                resolve({ success: true, message: "Deleted successfully" });
            }
        });
    });
};
exports.deleteFile = deleteFile;
exports.S3 = S3Object;
//# sourceMappingURL=s3.js.map