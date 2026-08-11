import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
import { Admin, CurrentUser } from '../auth/decorators';
import { ProductRate } from './models';
import { User } from '../users/models';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly jwtService: JwtService,
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
    @UploadedFiles() productImages: Express.Multer.File[],
    @Req() req: { body: CreateProductDto },
  ): Promise<ProductEntity> {
    return this.productsService.createProduct(req.body, productImages);
  }

  @Get()
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
    @CurrentUser() user: User,
  ): Promise<Product[]> {
    return this.productsService.findAll(
      isActive,
      isPromo,
      phrase,
      user.username,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOperation({ summary: 'Get product' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Product',
  })
  @ApiParam({ name: 'id' })
  find(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Product | null> {
    return this.productsService.findOneById(id, user.username);
  }

  @UseGuards(RolesGuard)
  @Admin()
  @Delete(':id')
  @ApiOperation({ summary: 'Remove product' })
  @ApiResponse({
    status: 200,
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
  @Put(':id')
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
  ): Promise<ProductEntity> {
    return null;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('rate')
  @ApiOperation({ summary: 'Create the rate for product' })
  @ApiResponse({
    status: 200,
    description: 'The create of rate',
    type: 'ProductRate',
  })
  createRate(
    @Body() createRateDto: CreateProductRateDto,
    @CurrentUser() user: User,
  ): Promise<ProductRate> {
    return this.productRatesService.createProductRate(
      createRateDto,
      user.username,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('rate')
  @ApiOperation({ summary: 'Update the rate for product' })
  @ApiResponse({
    status: 200,
    description: 'The update of rate',
    type: 'ProductRate',
  })
  updateProductRate(
    @Body() updateRateDto: UpdateProductRateDto,
    @CurrentUser() user: User,
  ): Promise<ProductRate> {
    return this.productRatesService.updateProductRate(
      updateRateDto,
      user.username,
    );
  }
}
