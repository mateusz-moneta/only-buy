import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './models';
import { ProductsService } from './services';
import { ProductEntity } from './entities';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('new')
  @ApiOperation({ summary: 'Create product' })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return null;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: 'Product',
  })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
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
  find(@Param('id') id: string): Promise<ProductEntity | null> {
    return this.productsService.findOneById(id);
  }

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
  ): Promise<Product> {
    return null;
  }
}
