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
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import {
  CreateProductDto,
  CreateProductRateDto,
  UpdateProductDto,
  UpdateProductRateDto,
} from './dto';
import { ProductEntity } from './entities';
import { ProductRatesService, ProductsService } from './services';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly productsService: ProductsService,
    private readonly productRatesService: ProductRatesService,
  ) {}

  @Post('new')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FilesInterceptor('productImages'))
  @ApiOperation({ summary: 'Create the product' })
  create(
    @UploadedFiles() productImages: Express.Multer.File[],
    @Req() req: { body: CreateProductDto },
  ): Promise<ProductEntity> {
    console.log(req.body);
    console.log(productImages);
    return this.productsService.createProduct(req.body, productImages);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: ProductEntity,
    isArray: true,
  })
  findAll(
    @Query('isActive') isActive: boolean,
    @Query('isPromo') isPromo: boolean,
  ): Promise<ProductEntity[]> {
    return this.productsService.findAll(isActive, isPromo);
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
  ): Promise<ProductEntity> {
    return null;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('rate')
  @ApiOperation({ summary: 'Create the rate for product' })
  @ApiResponse({
    status: 200,
    description: 'The create of rate',
    type: 'boolean',
  })
  createRate(
    @Body() createRateDto: CreateProductRateDto,
    @Req() request: Request,
  ): Promise<boolean> {
    const token = request.headers['authorization'].replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token);

    if (!decodedToken || !decodedToken.hasOwnProperty('username')) {
      throw new UnauthorizedException('Invalid token or missing username');
    }

    const { username } = decodedToken;

    return this.productRatesService.createProductRate(createRateDto, username);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('rate')
  @ApiOperation({ summary: 'Update the rate for product' })
  @ApiResponse({
    status: 200,
    description: 'The update of rate',
    type: 'boolean',
  })
  updateProductRate(
    @Body() updateRateDto: UpdateProductRateDto,
    @Req() request: Request,
  ): Promise<boolean> {
    const token = request.headers['authorization'].replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token);

    if (!decodedToken || !decodedToken.hasOwnProperty('username')) {
      throw new UnauthorizedException('Invalid token or missing username');
    }

    const { username } = decodedToken;

    return this.productRatesService.updateProductRate(updateRateDto, username);
  }
}
