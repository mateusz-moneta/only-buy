import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';

@Injectable()
export class UploadService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads/');
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        this.validateFile(file);
        cb(null, true);
      },
    };
  }

  async uploadFile(file: any): Promise<string> {
    this.validateFile(file);

    return new Promise<string>((resolve, reject) => {
      multer({ storage: this.createMulterOptions().storage }).single('file')(
        file,
        undefined,
        (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(file.path);
          }
        },
      );
    });
  }

  private validateFile(file: any): void {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Invalid file format');
    }
  }
}
