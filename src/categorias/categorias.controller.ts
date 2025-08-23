import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { FindAllCategoriasDto } from './dto/find-all-categorias.dto';
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
  async findAll(@Payload() dto: FindAllCategoriasDto) {
    const hasFilters = Boolean(dto?.search || dto?.slug || dto?.color || dto?.orderBy || dto?.order);
    if (hasFilters) {
      return this.findAllCategorias.execute(dto);
    }

    // Sin filtros: devolver todas las categorías (sin paginar)
    // Agrega por páginas para evitar el límite de protección del repositorio
    const perPage = 100;
    const firstPage = await this.findAllCategorias.execute({ ...dto, page: 1, limit: perPage });
    const allItems = [...firstPage.items];
    const totalPages = Math.max(1, Math.ceil(firstPage.total / perPage));
    for (let p = 2; p <= totalPages; p++) {
      const pageData = await this.findAllCategorias.execute({ ...dto, page: p, limit: perPage });
      allItems.push(...pageData.items);
    }
    return allItems;
  }

  @MessagePattern('findOneCategoria')
  findOne(@Payload() payload: any) {
    const id = typeof payload === 'number' ? payload : Number(payload?.id);
    const withPosts = !!(typeof payload === 'object' && payload?.withPosts);
    console.log('findOneCategoria', { id, withPosts });
    return this.findOneCategoria.execute(id, withPosts);
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
