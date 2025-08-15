import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';

@Controller('products/:productId/lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) { }

  @Post()
  create(@Param('productId') productId: string, @Body() createLotDto: CreateLotDto) {
    return this.lotsService.create(productId, createLotDto);
  }

  @Get()
  findAll(@Param('productId') productId: string) {
    return this.lotsService.findAllByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('productId') productId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.lotsService.findOne(productId, id);
  }

  @Patch(':id')
  update(@Param('productId') productId: string, @Param('id', ParseUUIDPipe) id: string, @Body() updateLotDto: UpdateLotDto) {
    return this.lotsService.update(productId, id, updateLotDto);
  }

  @Delete(':id')
  remove(@Param('productId') productId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.lotsService.remove(productId, id);
  }

  @Patch(':id/restore')
  restore(@Param('productId') productId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.lotsService.restore(productId, id);
  }
}
