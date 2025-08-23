import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCategoriaDto } from '../../dto/update-categoria.dto';
import { Categoria } from '../../entities/categoria.entity';
import { CATEGORIAS_REPOSITORY } from '../../tokens';
import { ICategoriasRepository } from '../../domain/repositories/categorias.repository';

@Injectable()
export class UpdateCategoriaUseCase {
  constructor(
    @Inject(CATEGORIAS_REPOSITORY)
    private readonly repo: ICategoriasRepository,
  ) {}

  async execute(dto: UpdateCategoriaDto): Promise<Categoria> {
    const { id, nombre, descripcion } = dto;
    const data: any = {};
    if (typeof nombre === 'string') data.nombre = nombre.trim();
    if (typeof descripcion === 'string') data.descripcion = descripcion.trim();
    if (typeof (dto as any).slug === 'string') data.slug = (dto as any).slug.trim();
    if (typeof (dto as any).color === 'string') data.color = (dto as any).color.trim();
    if (typeof (dto as any).icono === 'string') data.icono = (dto as any).icono.trim();

    // Si se actualiza nombre pero no se envía slug, generar uno simple
    if (data.nombre && data.slug === undefined) {
      data.slug = data.nombre.toLowerCase().replace(/\s+/g, '-');
    }
    const updated = await this.repo.update(id, data);
    if (!updated) throw new NotFoundException(`Categoria ${id} no encontrada`);
    return updated;
  }
}
