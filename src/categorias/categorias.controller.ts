import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CreateCategoriaUseCase } from './application/use-cases/create-categoria.usecase';
import { FindAllCategoriasUseCase } from './application/use-cases/find-all-categorias.usecase';
import { FindOneCategoriaUseCase } from './application/use-cases/find-one-categoria.usecase';
import { UpdateCategoriaUseCase } from './application/use-cases/update-categoria.usecase';
import { RemoveCategoriaUseCase } from './application/use-cases/remove-categoria.usecase';

@Controller()
export class CategoriasController {
  constructor(
    private readonly createCategoria: CreateCategoriaUseCase,
    private readonly findAllCategorias: FindAllCategoriasUseCase,
    private readonly findOneCategoria: FindOneCategoriaUseCase,
    private readonly updateCategoria: UpdateCategoriaUseCase,
    private readonly removeCategoria: RemoveCategoriaUseCase,
  ) {}

  @MessagePattern('createCategoria')
  create(@Payload() createCategoriaDto: CreateCategoriaDto) {
    // console.log('createCategoria', createCategoriaDto);
    return this.createCategoria.execute(createCategoriaDto);
  }

  @MessagePattern('findAllCategorias')
  findAll() {
    return this.findAllCategorias.execute();
  }

  @MessagePattern('findOneCategoria')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    console.log('findOneCategoria', id);
    return this.findOneCategoria.execute(id);
  }

  @MessagePattern('updateCategoria')
  update(@Payload() updateCategoriaDto: UpdateCategoriaDto) {
    console.log('updateCategoria', updateCategoriaDto);
    return this.updateCategoria.execute(updateCategoriaDto);
  }

  @MessagePattern('removeCategoria')
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.removeCategoria.execute(id);
  }
}
