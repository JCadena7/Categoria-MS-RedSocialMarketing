import { Inject, Injectable } from '@nestjs/common';
import { CATEGORIAS_REPOSITORY } from '../../tokens';
import { ICategoriasRepository } from '../../domain/repositories/categorias.repository';
import { Categoria } from '../../entities/categoria.entity';

export interface CategoriaConHijos extends Categoria {
  children?: CategoriaConHijos[];
}

@Injectable()
export class GetCategoriasJerarquicasUseCase {
  constructor(
    @Inject(CATEGORIAS_REPOSITORY)
    private readonly repo: ICategoriasRepository,
  ) {}

  async execute(): Promise<CategoriaConHijos[]> {
    // Obtener todas las categorías activas
    const result = await this.repo.findAll({ limit: 1000 });
    const categorias = result.items.filter(c => c.is_active);

    // Construir árbol jerárquico
    const categoriasMap = new Map<number, CategoriaConHijos>();
    const raices: CategoriaConHijos[] = [];

    // Crear mapa de categorías
    categorias.forEach(cat => {
      categoriasMap.set(cat.id!, { ...cat, children: [] });
    });

    // Construir jerarquía
    categorias.forEach(cat => {
      const categoria = categoriasMap.get(cat.id!);
      if (!categoria) return;

      if (cat.parent_id === null || cat.parent_id === undefined) {
        raices.push(categoria);
      } else {
        const parent = categoriasMap.get(cat.parent_id);
        if (parent) {
          parent.children!.push(categoria);
        } else {
          // Si el padre no existe, tratarla como raíz
          raices.push(categoria);
        }
      }
    });

    // Ordenar por display_order
    const sortByDisplayOrder = (cats: CategoriaConHijos[]) => {
      cats.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      cats.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          sortByDisplayOrder(cat.children);
        }
      });
    };

    sortByDisplayOrder(raices);

    return raices;
  }
}
