import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from '../../dto/create-categoria.dto';
import { Categoria } from '../../entities/categoria.entity';
import { CATEGORIAS_REPOSITORY } from '../../tokens';
import { ICategoriasRepository } from '../../domain/repositories/categorias.repository';

@Injectable()
export class CreateCategoriaUseCase {
  constructor(
    @Inject(CATEGORIAS_REPOSITORY)
    private readonly repo: ICategoriasRepository,
  ) {}

  async execute(dto: CreateCategoriaDto): Promise<Categoria> {
    const data = {
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion.trim(),
    };
    return this.repo.create(data);
  }
}
