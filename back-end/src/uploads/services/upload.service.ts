import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  saveFile(file: Express.Multer.File, folder: string): string {
    this.validateFile(file);

    const destination = path.join(process.cwd(), 'uploads', folder);

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, {
        recursive: true,
      });
    }

    const filename = `${Date.now()}-${file.originalname}`;

    const filePath = path.join(destination, filename);

    fs.writeFileSync(filePath, file.buffer);

    return path.join('uploads', folder, filename).replace(/\\/g, '/');
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Invalid file format');
    }
  }
}
