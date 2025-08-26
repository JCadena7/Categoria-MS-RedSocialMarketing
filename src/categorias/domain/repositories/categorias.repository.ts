import { Categoria } from '../../entities/categoria.entity';

export type CreateCategoriaData = Omit<Categoria, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCategoriaData = Partial<CreateCategoriaData>;

export interface ICategoriasRepository {
  create(data: CreateCategoriaData): Promise<Categoria>;
  findAll(): Promise<Categoria[]>;
  findOne(id: number): Promise<Categoria | null>;
  update(id: number, data: UpdateCategoriaData): Promise<Categoria | null>;
  remove(id: number): Promise<boolean>;
}
