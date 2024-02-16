import { Controller, Get, Param } from '@nestjs/common';
import { join } from 'path';
import { Public } from 'src/auth/decorators';

@Controller('uploads')
export class UploadsController {
  @Public()
  @Get(':filename')
  getImage(@Param('filename') filename: string) {
    console.log(filename);
    return { url: join(__dirname, '..', 'uploads', filename) };
  }
}