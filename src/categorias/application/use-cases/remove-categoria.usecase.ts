import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORIAS_REPOSITORY } from '../../tokens';
import { ICategoriasRepository } from '../../domain/repositories/categorias.repository';

@Injectable()
export class RemoveCategoriaUseCase {
  constructor(
    @Inject(CATEGORIAS_REPOSITORY)
    private readonly repo: ICategoriasRepository,
  ) {}

  async execute(id: number): Promise<{ removed: boolean } | never> {
    const ok = await this.repo.remove(id);
    if (!ok) throw new NotFoundException(`Categoria ${id} no encontrada`);
    return { removed: true };
  }
}
