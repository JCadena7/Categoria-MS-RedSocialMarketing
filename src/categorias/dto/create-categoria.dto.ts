import { Type,  Transform} from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsDateString, IsInt, IsBoolean } from 'class-validator';

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

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    parent_id?: number | null;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    display_order?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    created_by?: number | null;

    // Opcionales: normalmente los maneja la BD
    @IsOptional()
    @IsDateString()
    created_at?: string;

    @IsOptional()
    @IsDateString()
    updated_at?: string;
}
