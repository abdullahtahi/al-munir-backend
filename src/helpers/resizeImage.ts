const uniqId = require('uniqid');
const path = require('path');
const s3 = require('./s3');

export class Resize {
  async save(buffer, folder = '', fileMimetype = '') {
    const filename = Resize.filename();
    // const file = await sharp(buffer).resize(1024, 768, {
    //   fit: sharp.fit.inside,
    //   withoutEnlargement: true,
    // });
    const response = await s3.uploadsFile(
      filename,
      buffer,
      folder,
      'file',
      fileMimetype
    );
    if (response.success) {
      return filename;
    } else {
      return response;
    }
  }
  static filename() {
    return `${uniqId()}-${Date.now()}.jpg`;
  }
}
