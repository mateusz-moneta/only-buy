import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';
import { ProductsService } from './services';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('new')
  @ApiOperation({ summary: 'Create product' })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return null;
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: Product
  })
  findAll(): Promise<Product[]> {
    return null;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Product
  })
  @ApiParam({ name: 'id' })
  find(@Param('id') id: string): Promise<Product> {
    return null;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove product' })
  @ApiResponse({
    status: 200,
    description: 'The remove record',
    type: Product
  })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string): Promise<Product> {
    return null;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({
    status: 200,
    description: 'The update record',
    type: Product
  })
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return null;
  }
}