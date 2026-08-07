import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UnitsService } from './units.service';
import { UnitType } from '@/resources/units/entities/unit.entity';
import { UnitDto } from '@/core/swagger/resource.dto';
import {
  ApiErrorResponses,
  ApiWrappedOk,
  ApiWrappedOkArray,
} from '@/core/swagger/api-responses.decorator';

@ApiTags('units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les unités' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'type', required: false, enum: UnitType })
  @ApiWrappedOkArray(UnitDto)
  @ApiErrorResponses(400, 500)
  findAll(@Query('search') search?: string, @Query('type') type?: UnitType) {
    return this.unitsService.findAll(search, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une unité' })
  @ApiParam({ name: 'id' })
  @ApiWrappedOk(UnitDto)
  @ApiErrorResponses(400, 404, 500)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitsService.findOne(id);
  }
}
