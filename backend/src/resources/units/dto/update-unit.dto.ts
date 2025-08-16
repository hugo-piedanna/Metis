import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitDto } from '@/resources/units/dto/create-unit.dto';

export class UpdateUnitDto extends PartialType(CreateUnitDto) { }
