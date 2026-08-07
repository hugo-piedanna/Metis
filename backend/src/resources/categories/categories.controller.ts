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
import { CategoriesService } from '@/resources/categories/categories.service';
import { CreateCategoryDto } from '@/resources/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@/resources/categories/dto/update-category.dto';
import { CategoryDto } from '@/core/swagger/resource.dto';
import {
  ApiErrorResponses,
  ApiWrappedCreated,
  ApiWrappedOk,
  ApiWrappedOkArray,
  ApiWrappedOkNull,
} from '@/core/swagger/api-responses.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une catégorie' })
  @ApiWrappedCreated(CategoryDto)
  @ApiErrorResponses(400, 500)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les catégories' })
  @ApiQuery({ name: 'search', required: false })
  @ApiWrappedOkArray(CategoryDto)
  @ApiErrorResponses(500)
  findAll(@Query('search') search?: string) {
    return this.categoriesService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une catégorie' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOk(CategoryDto)
  @ApiErrorResponses(400, 404, 410, 500)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une catégorie' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOk(CategoryDto)
  @ApiErrorResponses(400, 404, 410, 500)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete une catégorie' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOkNull()
  @ApiErrorResponses(400, 404, 410, 500)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurer une catégorie' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOk(CategoryDto)
  @ApiErrorResponses(400, 404, 500)
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.restore(id);
  }
}
