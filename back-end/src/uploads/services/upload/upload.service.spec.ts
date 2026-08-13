import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { UploadService } from './upload.service';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

describe(UploadService.name, () => {
  let service: UploadService;

  beforeEach(() => {
    jest.clearAllMocks();

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    service = new UploadService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteFile', () => {
    const filePath = 'uploads/products/image.png';

    it('should delete file when file exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      service.deleteFile(filePath);

      const absolutePath = path.join(process.cwd(), filePath);

      expect(fs.existsSync).toHaveBeenCalledTimes(1);

      expect(fs.existsSync).toHaveBeenCalledWith(absolutePath);

      expect(fs.unlinkSync).toHaveBeenCalledTimes(1);

      expect(fs.unlinkSync).toHaveBeenCalledWith(absolutePath);
    });

    it('should not delete file when file does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      service.deleteFile(filePath);

      const absolutePath = path.join(process.cwd(), filePath);

      expect(fs.existsSync).toHaveBeenCalledTimes(1);

      expect(fs.existsSync).toHaveBeenCalledWith(absolutePath);

      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should build absolute path from current working directory', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      service.deleteFile(filePath);

      expect(fs.existsSync).toHaveBeenCalledWith(
        path.join(process.cwd(), filePath),
      );
    });

    it('should handle nested file paths', () => {
      const nestedPath = 'uploads/product-images/product-id/image.png';

      (fs.existsSync as jest.Mock).mockReturnValue(true);

      service.deleteFile(nestedPath);

      expect(fs.unlinkSync).toHaveBeenCalledWith(
        path.join(process.cwd(), nestedPath),
      );
    });
  });

  describe('saveFile', () => {
    const file = {
      originalname: 'image.png',
      mimetype: 'image/png',
      buffer: Buffer.from('image content'),
    } as Express.Multer.File;

    const folder = 'products';

    beforeEach(() => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
    });

    it('should throw BadRequestException when file is not provided', () => {
      expect(() =>
        service.saveFile(undefined as unknown as Express.Multer.File, folder),
      ).toThrow(new BadRequestException('File is required'));

      expect(fs.writeFileSync).not.toHaveBeenCalled();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when file is not an image', () => {
      const textFile = {
        originalname: 'document.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from('text'),
      } as Express.Multer.File;

      expect(() => service.saveFile(textFile, folder)).toThrow(
        new BadRequestException('Invalid file format'),
      );

      expect(fs.writeFileSync).not.toHaveBeenCalled();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should create destination directory when it does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      service.saveFile(file, folder);

      const destination = path.join(process.cwd(), 'uploads', folder);

      expect(fs.existsSync).toHaveBeenCalledWith(destination);

      expect(fs.mkdirSync).toHaveBeenCalledTimes(1);

      expect(fs.mkdirSync).toHaveBeenCalledWith(destination, {
        recursive: true,
      });
    });

    it('should not create destination directory when it already exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      service.saveFile(file, folder);

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should write file to destination', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      service.saveFile(file, folder);

      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

      const writeFileCall = (fs.writeFileSync as jest.Mock).mock.calls[0];

      expect(writeFileCall[1]).toBe(file.buffer);
    });

    it('should use original file name in generated file name', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      service.saveFile(file, folder);

      const writeFileCall = (fs.writeFileSync as jest.Mock).mock.calls[0];

      const writtenPath = writeFileCall[0] as string;

      expect(writtenPath).toContain('image.png');
    });

    it('should return relative file path', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = service.saveFile(file, folder);

      expect(result).toContain('uploads/products/');

      expect(result).toContain('image.png');

      expect(result).not.toContain('\\');
    });

    it('should normalize Windows path separators in returned path', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = service.saveFile(file, 'products/nested');

      expect(result).not.toContain('\\');

      expect(result).toContain('uploads/products/nested/');
    });

    it('should save file buffer', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      service.saveFile(file, folder);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        file.buffer,
      );
    });

    it('should generate file name with timestamp', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(123456789);

      service.saveFile(file, folder);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('123456789-image.png'),
        file.buffer,
      );

      dateNowSpy.mockRestore();
    });

    it('should support different image mime types', () => {
      const imageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
      ];

      for (const mimetype of imageTypes) {
        const imageFile = {
          ...file,
          mimetype,
        } as Express.Multer.File;

        expect(() => service.saveFile(imageFile, folder)).not.toThrow();
      }
    });
  });
});
