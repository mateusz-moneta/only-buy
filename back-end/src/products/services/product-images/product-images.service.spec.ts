import { Repository } from 'typeorm';

import { CreateProductImageDto } from '../../dto';
import { ProductImageEntity } from '../../entities';
import { ProductImagesService } from './product-images.service';

describe(ProductImagesService.name, () => {
  let service: ProductImagesService;

  const productImagesRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ProductImagesService(
      productImagesRepository as unknown as Repository<ProductImageEntity>,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProductImage', () => {
    const dto: CreateProductImageDto = {
      productId: 'product-id',
      path: 'uploads/product-images/image.png',
    };

    it('should create and save product image', async () => {
      const image = {
        id: 'image-id',
        ...dto,
      } as unknown as ProductImageEntity;

      productImagesRepository.create.mockReturnValue(image);
      productImagesRepository.save.mockResolvedValue(image);

      const result = await service.createProductImage(dto);

      expect(productImagesRepository.create).toHaveBeenCalledTimes(1);

      expect(productImagesRepository.create).toHaveBeenCalledWith(dto);

      expect(productImagesRepository.save).toHaveBeenCalledTimes(1);

      expect(productImagesRepository.save).toHaveBeenCalledWith(image);

      expect(result).toBe(image);
    });

    it('should pass product id and path to repository create', async () => {
      const image = {
        id: 'image-id',
        productId: 'product-id',
        path: 'uploads/product-images/image.png',
      } as unknown as ProductImageEntity;

      productImagesRepository.create.mockReturnValue(image);
      productImagesRepository.save.mockResolvedValue(image);

      await service.createProductImage(dto);

      expect(productImagesRepository.create).toHaveBeenCalledWith({
        productId: 'product-id',
        path: 'uploads/product-images/image.png',
      });
    });
  });

  describe('delete', () => {
    it('should delete product image by id', async () => {
      productImagesRepository.delete.mockResolvedValue({
        affected: 1,
      });

      await service.delete('image-id');

      expect(productImagesRepository.delete).toHaveBeenCalledTimes(1);

      expect(productImagesRepository.delete).toHaveBeenCalledWith('image-id');
    });
  });

  describe('findAll', () => {
    it('should return all product images', async () => {
      const images = [
        {
          id: 'image-1',
          path: 'uploads/image-1.png',
        },
        {
          id: 'image-2',
          path: 'uploads/image-2.png',
        },
      ] as unknown as ProductImageEntity[];

      productImagesRepository.find.mockResolvedValue(images);

      const result = await service.findAll();

      expect(productImagesRepository.find).toHaveBeenCalledTimes(1);

      expect(productImagesRepository.find).toHaveBeenCalledWith();

      expect(result).toBe(images);
    });

    it('should return empty array when there are no product images', async () => {
      productImagesRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(productImagesRepository.find).toHaveBeenCalledTimes(1);

      expect(result).toEqual([]);
    });
  });

  describe('findByIds', () => {
    it('should return product images by ids and product id', async () => {
      const ids = ['image-1', 'image-2'];
      const productId = 'product-id';

      const images = [
        {
          id: 'image-1',
          path: 'uploads/image-1.png',
        },
        {
          id: 'image-2',
          path: 'uploads/image-2.png',
        },
      ] as unknown as ProductImageEntity[];

      const query = createQueryBuilder();

      query.getMany.mockResolvedValue(images);

      const result = await service.findByIds(ids, productId);

      expect(productImagesRepository.createQueryBuilder).toHaveBeenCalledWith(
        'image',
      );

      expect(query.where).toHaveBeenCalledWith('image.id IN (:...ids)', {
        ids,
      });

      expect(query.andWhere).toHaveBeenCalledWith(
        'image.productId = :productId',
        {
          productId,
        },
      );

      expect(query.getMany).toHaveBeenCalledTimes(1);

      expect(result).toBe(images);
    });

    it('should return empty array when no matching images exist', async () => {
      const query = createQueryBuilder();

      query.getMany.mockResolvedValue([]);

      const result = await service.findByIds(['unknown-image'], 'product-id');

      expect(query.getMany).toHaveBeenCalledTimes(1);

      expect(result).toEqual([]);
    });
  });

  describe('findOneById', () => {
    it('should return product image by id', async () => {
      const image = {
        id: 'image-id',
        path: 'uploads/image.png',
      } as unknown as ProductImageEntity;

      productImagesRepository.findOneBy.mockResolvedValue(image);

      const result = await service.findOneById('image-id');

      expect(productImagesRepository.findOneBy).toHaveBeenCalledTimes(1);

      expect(productImagesRepository.findOneBy).toHaveBeenCalledWith({
        id: 'image-id',
      });

      expect(result).toBe(image);
    });

    it('should return null when product image does not exist', async () => {
      productImagesRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOneById('unknown-image');

      expect(productImagesRepository.findOneBy).toHaveBeenCalledWith({
        id: 'unknown-image',
      });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove product image by id', async () => {
      productImagesRepository.delete.mockResolvedValue({
        affected: 1,
      });

      await service.remove('image-id');

      expect(productImagesRepository.delete).toHaveBeenCalledTimes(1);

      expect(productImagesRepository.delete).toHaveBeenCalledWith('image-id');
    });
  });

  function createQueryBuilder() {
    const query = {
      where: jest.fn(),
      andWhere: jest.fn(),
      getMany: jest.fn(),
    };

    query.where.mockReturnValue(query);
    query.andWhere.mockReturnValue(query);

    productImagesRepository.createQueryBuilder.mockReturnValue(query);

    return query;
  }
});
