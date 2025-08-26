import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Categoria } from '../../entities/categoria.entity';
import { CATEGORIAS_REPOSITORY } from '../../tokens';
import { ICategoriasRepository } from '../../domain/repositories/categorias.repository';

@Injectable()
export class FindOneCategoriaUseCase {
  constructor(
    @Inject(CATEGORIAS_REPOSITORY)
    private readonly repo: ICategoriasRepository,
  ) {}

  async execute(id: number): Promise<Categoria> {
    const found = await this.repo.findOne(id);
    if (!found) throw new NotFoundException(`Categoria ${id} no encontrada`);
    return found;
  }
}
