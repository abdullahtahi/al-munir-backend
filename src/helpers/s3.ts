
const fs = require('fs');
const S3Client = require('aws-sdk/clients/s3');
// const S3Object = new S3Client({
//   region: process.env.S3_REGION,
//   accessKeyId: process.env.S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   signatureVersion: process.env.S3_SIGNATURE_VERSION,
// });
const S3Object = new S3Client({
  region: 'ap-south-1',
  accessKeyId: 'AKIAYCAVQJL6XOII27EY',
  secretAccessKey: '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',
  signatureVersion: 'v4',
});
export const bucketName = process.env.S3_BUCKET_NAME;

export const uploadsFile = (
  fileName: any,
  file: any,
  folder: any = '',
  type = 'file',
  fileMimetype = '',
) => {
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
      } else {
        resolve({ success: true, data, key: fileName });
      }
    });
  });
};
export const deleteFile = async (fileKey) => {
  return new Promise((resolve, reject) => {
    const deleteParams = {
      Bucket: bucketName,
      Key: fileKey.filePath,
    };
    S3Object.deleteObject(deleteParams, (err, data) => {
      if (err) {
        resolve({ success: false, message: err.stack });
      } else {
        resolve({ success: true, message: "Deleted successfully" });
      }
    });
  });
};

export const S3 = S3Object;
