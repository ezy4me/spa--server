import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { ProductDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Public()
  @Get(':productId')
  async getOneProductById(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<Product | null> {
    return this.productService.getOneProductById(productId);
  }

  @Post()
  async createProduct(@Body() productDto: ProductDto): Promise<Product> {
    return this.productService.createProduct(productDto);
  }

  @Put(':productId')
  async updateProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() productDto: ProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(productId, productDto);
  }

  @Delete(':productId')
  async deleteProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<Product | null> {
    return this.productService.deleteProduct(productId);
  }
}
