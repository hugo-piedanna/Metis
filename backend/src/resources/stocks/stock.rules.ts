import { BadRequestException } from '@nestjs/common';
import { ProductType } from '@/resources/products/entities/product.entity';

/** Compare des dates calendaires YYYY-MM-DD (UTC). */
export function toDateOnly(value: string | Date): string {
  if (typeof value === 'string') return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

export function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * - EQUIPMENT : aucune date d’expiration autorisée
 * - FOOD : date optionnelle ; si présente, doit être ≥ aujourd’hui
 */
export function assertStockExpiration(
  productType: ProductType,
  expirationDate?: string | Date | null,
): void {
  const hasDate =
    expirationDate !== undefined &&
    expirationDate !== null &&
    expirationDate !== '';

  if (productType === ProductType.EQUIPMENT && hasDate) {
    throw new BadRequestException(
      'Equipment stock lines cannot have an expiration date',
    );
  }

  if (!hasDate) return;

  const date = toDateOnly(expirationDate as string | Date);
  if (date < todayDateOnly()) {
    throw new BadRequestException('Expiration date cannot be in the past');
  }
}
