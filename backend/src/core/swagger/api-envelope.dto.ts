import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorItemDto {
  @ApiProperty({ example: '404' })
  code: string;

  @ApiProperty({
    enum: ['critical', 'informative', 'warning'],
    example: 'critical',
  })
  type: 'critical' | 'informative' | 'warning';
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: 'Not Found' })
  message: string;

  @ApiProperty({
    type: 'object',
    nullable: true,
    example: null,
    additionalProperties: true,
  })
  data: Record<string, never> | null;

  @ApiProperty({ type: () => [ApiErrorItemDto] })
  errors: ApiErrorItemDto[];
}

export class ApiSuccessResponseDto {
  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiPropertyOptional({
    type: 'object',
    nullable: true,
    additionalProperties: true,
  })
  data?: Record<string, unknown> | null;

  @ApiProperty({ type: () => [ApiErrorItemDto], example: [] })
  errors: ApiErrorItemDto[];
}
