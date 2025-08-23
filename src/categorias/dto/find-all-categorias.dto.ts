import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

function toNumberOrDefault(value: any, def: number): number {
  if (value === undefined || value === null || value === '') return def;
  const n = Number(value);
  return Number.isNaN(n) ? def : n;
}

function trim(v: any) {
  return typeof v === 'string' ? v.trim() : v;
}

export class FindAllCategoriasDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => toNumberOrDefault(value, 1))
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => toNumberOrDefault(value, 10))
  limit?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => trim(value))
  search?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => trim(value))
  slug?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => trim(value))
  color?: string;

  @IsOptional()
  @IsIn(['id', 'nombre', 'created_at', 'updated_at'])
  orderBy?: 'id' | 'nombre' | 'created_at' | 'updated_at';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value))
  order?: 'asc' | 'desc';
}
