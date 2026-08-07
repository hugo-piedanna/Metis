import { PartialType } from '@nestjs/swagger';
import { CreateStockDto } from '@/resources/stocks/dto/create-stock.dto';

export class UpdateStockDto extends PartialType(CreateStockDto) {}
