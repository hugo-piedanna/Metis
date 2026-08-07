import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { StocksService } from '@/resources/stocks/stocks.service';
import { CreateStockDto } from '@/resources/stocks/dto/create-stock.dto';
import { UpdateStockDto } from '@/resources/stocks/dto/update-stock.dto';
import { StockDto } from '@/core/swagger/resource.dto';
import {
  ApiErrorResponses,
  ApiWrappedCreated,
  ApiWrappedOk,
  ApiWrappedOkArray,
  ApiWrappedOkNull,
} from '@/core/swagger/api-responses.decorator';

@ApiTags('stocks')
@Controller('products/:productId/stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter une ligne de stock' })
  @ApiParam({ name: 'productId' })
  @ApiWrappedCreated(StockDto)
  @ApiErrorResponses(400, 404, 410, 500)
  create(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() createStockDto: CreateStockDto,
  ) {
    return this.stocksService.create(productId, createStockDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les stocks d’un produit' })
  @ApiParam({ name: 'productId' })
  @ApiWrappedOkArray(StockDto)
  @ApiErrorResponses(400, 404, 410, 500)
  findAll(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.stocksService.findAllByProduct(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une ligne de stock' })
  @ApiParam({ name: 'productId' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOk(StockDto)
  @ApiErrorResponses(400, 404, 410, 500)
  findOne(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.stocksService.findOne(productId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une ligne de stock' })
  @ApiParam({ name: 'productId' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOk(StockDto)
  @ApiErrorResponses(400, 404, 410, 500)
  update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stocksService.update(productId, id, updateStockDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete une ligne de stock' })
  @ApiParam({ name: 'productId' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOkNull()
  @ApiErrorResponses(400, 404, 410, 500)
  remove(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.stocksService.remove(productId, id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurer une ligne de stock' })
  @ApiParam({ name: 'productId' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOk(StockDto)
  @ApiErrorResponses(400, 404, 500)
  restore(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.stocksService.restore(productId, id);
  }
}
