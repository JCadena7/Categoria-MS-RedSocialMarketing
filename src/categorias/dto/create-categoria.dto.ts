import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsDateString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoriaDto {
    // Opcional: normalmente lo genera la BD
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    id?: number;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    nombre!: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    descripcion!: string;

    // Opcionales adicionales solicitados
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    slug?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    color?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    icono?: string;

    // Opcionales: normalmente los maneja la BD
    @IsOptional()
    @IsDateString()
    created_at?: string;

    @IsOptional()
    @IsDateString()
    updated_at?: string;
}
