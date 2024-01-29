import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  saveFile(file: Express.Multer.File, folder: string): string {
    this.validateFile(file);

    const destination = `uploads/${folder}`;

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const path = `${destination}/${file.originalname}`;
    fs.writeFileSync(path, file.buffer);

    return path;
  }

  private validateFile(file: any): void {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Invalid file format');
    }
  }
}
