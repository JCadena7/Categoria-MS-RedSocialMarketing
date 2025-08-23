import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { InMemoryCategoriasRepository } from './infrastructure/repositories/in-memory-categorias.repository';
import { CATEGORIAS_REPOSITORY } from './tokens';
import { CreateCategoriaUseCase } from './application/use-cases/create-categoria.usecase';
import { FindAllCategoriasUseCase } from './application/use-cases/find-all-categorias.usecase';
import { FindOneCategoriaUseCase } from './application/use-cases/find-one-categoria.usecase';
import { UpdateCategoriaUseCase } from './application/use-cases/update-categoria.usecase';
import { RemoveCategoriaUseCase } from './application/use-cases/remove-categoria.usecase';

@Module({
  controllers: [CategoriasController],
  providers: [
    { provide: CATEGORIAS_REPOSITORY, useClass: InMemoryCategoriasRepository },
    CreateCategoriaUseCase,
    FindAllCategoriasUseCase,
    FindOneCategoriaUseCase,
    UpdateCategoriaUseCase,
    RemoveCategoriaUseCase,
  ],
})
export class CategoriasModule {}
