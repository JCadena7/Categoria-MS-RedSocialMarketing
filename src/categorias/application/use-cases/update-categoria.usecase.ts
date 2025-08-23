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
    const data: { nombre?: string; descripcion?: string } = {};
    if (typeof nombre === 'string') data.nombre = nombre.trim();
    if (typeof descripcion === 'string') data.descripcion = descripcion.trim();
    const updated = await this.repo.update(id, data);
    if (!updated) throw new NotFoundException(`Categoria ${id} no encontrada`);
    return updated;
  }
}
