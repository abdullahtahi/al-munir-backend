import {
  BadRequestException,
  Controller,
  Delete,
  InternalServerErrorException,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import {
  MAX_PHOTO_SIZE,
  MAX_FILE_SIZE,
  IMAGE_EXTENTIONS,
  FILE_EXTENTIONS,
} from 'src/constants';
import { Resize } from 'src/helpers/resizeImage';
import * as fs from 'fs';
import { getErrorMessage } from 'src/helpers/errorMessage';
import { uploadsFile, deleteFile } from 'src/helpers/s3';
import { ApiTags } from '@nestjs/swagger';

const checkFileType = async (file: any, cb: any, fileTypes: any) => {
  const extensionName = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = fileTypes.test(file.mimetype);
  const isImageExtension = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isImageMimeType = fileTypes.test(file.mimetype);
  if (isImageExtension && isImageMimeType) {
    return cb(null, true);
  } else if (mimetype && extensionName) {
    return cb(null, true);
  }
  return cb(new BadRequestException(`Select ${fileTypes}`));
};
@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter(req, file, cb) {
        checkFileType(file, cb, IMAGE_EXTENTIONS);
      },
    })
  )
  @Post('image')
  async uploadImage(@UploadedFile() file: any, @Query() body: any) {

    const isImageExtension = IMAGE_EXTENTIONS.test(
      path.extname(file.originalname).toLowerCase()
    );

    let directory = '';
    if (body && body.directory !== '') {
      directory = body.directory;
    }
    const isImageMimeType = IMAGE_EXTENTIONS.test(file.mimetype);
    if (isImageExtension && isImageMimeType) {
      const fileUpload = new Resize();
      const filename = await fileUpload.save(
        file.buffer,
        directory !== '' ? directory : 'photos',
        file.mimetype
      );
      return {
        name: filename,
        path: 'photos' + '/' + filename,
      };
    } else {
      const fileName = `${file.originalname.split('.')[0]
        }-${Date.now()}${path.extname(file.originalname)}`;
      const response: any = await uploadsFile(
        fileName,
        file.buffer,
        directory !== '' ? directory : 'files',
        'file',
        file.mimetype
      );
      if (response.success) {
        return {
          name: fileName,
          path: 'photos' + '/' + fileName,
        };
      } else {
        return response;
      }
    }
  }

  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter(req, file, cb) {
        checkFileType(file, cb, FILE_EXTENTIONS);
      },
    })
  )

  @Post('file')
  async uploadFile(@UploadedFile() file: any, @Query() body: any) {
    try {
      const uploadDir = `${path.resolve()}/public/uploads`;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const isFileExtension = FILE_EXTENTIONS.test(
        path.extname(file.originalname).toLowerCase(),
      );
      if (isFileExtension) {

        let directory = '';
        if (body && body.directory !== '') {
          directory = body.directory;
        }

        const fileName = `${file.originalname.split('.')[0]
          }-${Date.now()}${path.extname(file.originalname)}`;
        const response: any = await uploadsFile(
          fileName,
          file.buffer,
          directory !== '' ? directory : 'company',
          'file',
          file.mimetype
        );
        console.log("response", response)
        if (response.success) {
          return {
            name: fileName,
            path: 'photos/' + fileName,
          };
        } else {
          return response;
        }

      } else {
        throw new InternalServerErrorException('Invalid file extension')
      }
    } catch (error) {
      throw new InternalServerErrorException(getErrorMessage(error));
    }
  }
  @Delete('file')
  async deleteFile(@Query() filePath: string) {
    try {
      if (!filePath) {
        throw new InternalServerErrorException('File path is required');
      }

      const response: any = await deleteFile(filePath);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(getErrorMessage(error));
    }
  }
}
