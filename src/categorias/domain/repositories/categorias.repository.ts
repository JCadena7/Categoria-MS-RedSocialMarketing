import { Categoria } from '../../entities/categoria.entity';

export type CreateCategoriaData = Omit<Categoria, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCategoriaData = Partial<CreateCategoriaData>;

export type OrderByCategoria = 'id' | 'nombre' | 'created_at' | 'updated_at' | 'display_order' | 'posts_count';
export type OrderDirection = 'asc' | 'desc';

export interface FindAllCategoriasOptions {
  page?: number;
  limit?: number;
  search?: string;
  slug?: string;
  color?: string;
  parent_id?: number | null;
  is_active?: boolean;
  orderBy?: OrderByCategoria;
  order?: OrderDirection;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ICategoriasRepository {
  create(data: CreateCategoriaData): Promise<Categoria>;
  findAll(options?: FindAllCategoriasOptions): Promise<Paginated<Categoria>>;
  findOne(id: number): Promise<Categoria | null>;
  update(id: number, data: UpdateCategoriaData): Promise<Categoria | null>;
  remove(id: number): Promise<boolean>;
}
