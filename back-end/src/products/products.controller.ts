import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { Product } from './models';
import {
  CreateProductDto,
  CreateProductRateDto,
  UpdateProductDto,
  UpdateProductRateDto,
} from './dto';
import { ProductEntity } from './entities';
import { ProductRatesService, ProductsService } from './services';
import { RolesGuard } from '../auth/guards';
import { Admin, CurrentUser, Public } from '../auth/decorators';
import { ProductRate } from './models';
import { Page } from '../shared/models';
import { JwtPayload } from '../auth/payloads';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productRatesService: ProductRatesService,
  ) {}

  @UseGuards(RolesGuard)
  @Admin()
  @Post('new')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FilesInterceptor('productImages'))
  @ApiOperation({ summary: 'Create the product' })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() productImages: Express.Multer.File[],
  ): Promise<ProductEntity> {
    return this.productsService.createProduct(createProductDto, productImages);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: 'Product',
    isArray: true,
  })
  findAll(
    @Query('isActive') isActive: boolean,
    @Query('isPromo') isPromo: boolean,
    @Query('phrase') phrase: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @CurrentUser() jwtPayload: JwtPayload,
  ): Promise<Page<Product>> {
    return this.productsService.findAll(
      isActive,
      isPromo,
      phrase,
      jwtPayload?.sub ?? '',
      page,
      limit,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get product' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Product',
  })
  @ApiParam({ name: 'id' })
  async find(
    @Param('id') id: string,
    @CurrentUser() { sub: userId }: JwtPayload,
  ): Promise<Product> {
    const product = await this.productsService.findOneById(id, userId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  @UseGuards(RolesGuard)
  @Admin()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove product' })
  @ApiResponse({
    status: 204,
    description: 'The remove record',
    type: 'Product',
  })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }

  @UseGuards(RolesGuard)
  @Admin()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FilesInterceptor('productImages'))
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({
    status: 200,
    description: 'The update record',
    type: 'Product',
  })
  @ApiParam({ name: 'id' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() productImages: Express.Multer.File[],
    @CurrentUser() { sub: userId }: JwtPayload,
  ): Promise<Product> {
    return this.productsService.updateProduct(
      id,
      updateProductDto,
      productImages,
      userId,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('rate')
  @ApiOperation({ summary: 'Create the rate for product' })
  @ApiResponse({
    status: 201,
    description: 'The create of rate',
    type: 'ProductRate',
  })
  createRate(
    @Body() createRateDto: CreateProductRateDto,
    @CurrentUser() { sub: userId }: JwtPayload,
  ): Promise<ProductRate> {
    return this.productRatesService.createProductRate(createRateDto, userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('rate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update the rate for product' })
  @ApiResponse({
    status: 200,
    description: 'The update of rate',
    type: 'ProductRate',
  })
  updateProductRate(
    @Body() updateRateDto: UpdateProductRateDto,
    @CurrentUser() { sub: userId }: JwtPayload,
  ): Promise<ProductRate> {
    return this.productRatesService.updateProductRate(updateRateDto, userId);
  }
}
