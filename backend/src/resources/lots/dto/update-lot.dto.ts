import { PartialType } from '@nestjs/mapped-types';
import { CreateLotDto } from '@/resources/lots/dto/create-lot.dto';

export class UpdateLotDto extends PartialType(CreateLotDto) { }
