import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProductsService } from '@/resources/products/products.service';
import { CreateProductDto } from '@/resources/products/dto/create-product.dto';
import { UpdateProductDto } from '@/resources/products/dto/update-product.dto';
import { ProductType } from '@/resources/products/entities/product.entity';
import { ProductDto } from '@/core/swagger/resource.dto';
import {
  ApiErrorResponses,
  ApiWrappedCreated,
  ApiWrappedOk,
  ApiWrappedOkArray,
  ApiWrappedOkNull,
} from '@/core/swagger/api-responses.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un produit' })
  @ApiWrappedCreated(ProductDto)
  @ApiErrorResponses(400, 404, 500)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les produits' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'type', required: false, enum: ProductType })
  @ApiWrappedOkArray(ProductDto)
  @ApiErrorResponses(400, 500)
  findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('type') type?: ProductType,
  ) {
    return this.productsService.findAll({ search, categoryId, type });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un produit' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOk(ProductDto)
  @ApiErrorResponses(400, 404, 410, 500)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un produit' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOk(ProductDto)
  @ApiErrorResponses(400, 404, 410, 500)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete un produit' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOkNull()
  @ApiErrorResponses(400, 404, 410, 500)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurer un produit' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOk(ProductDto)
  @ApiErrorResponses(400, 404, 500)
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.restore(id);
  }
}
