import { Inject, Injectable } from '@nestjs/common';
import { Categoria } from '../../entities/categoria.entity';
import { CATEGORIAS_REPOSITORY } from '../../tokens';
import { ICategoriasRepository } from '../../domain/repositories/categorias.repository';

@Injectable()
export class FindAllCategoriasUseCase {
  constructor(
    @Inject(CATEGORIAS_REPOSITORY)
    private readonly repo: ICategoriasRepository,
  ) {}

  async execute(): Promise<Categoria[]> {
    return this.repo.findAll();
  }
}
