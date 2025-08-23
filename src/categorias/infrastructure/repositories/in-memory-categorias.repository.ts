import { Injectable } from '@nestjs/common';
import { Categoria } from '../../entities/categoria.entity';
import { ICategoriasRepository, CreateCategoriaData, UpdateCategoriaData } from '../../domain/repositories/categorias.repository';

@Injectable()
export class InMemoryCategoriasRepository implements ICategoriasRepository {
  private items: Categoria[] = [];
  private seq = 1;

  async create(data: CreateCategoriaData): Promise<Categoria> {
    const now = new Date();
    const categoria: Categoria = {
      id: this.seq++,
      nombre: data.nombre,
      descripcion: data.descripcion,
      created_at: now,
      updated_at: now,
    };
    this.items.push(categoria);
    return categoria;
  }

  async findAll(): Promise<Categoria[]> {
    return [...this.items];
  }

  async findOne(id: number): Promise<Categoria | null> {
    return this.items.find((c) => c.id === id) ?? null;
  }

  async update(id: number, data: UpdateCategoriaData): Promise<Categoria | null> {
    const idx = this.items.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const updated: Categoria = {
      ...this.items[idx],
      ...data,
      updated_at: new Date(),
    };
    this.items[idx] = updated;
    return updated;
  }

  async remove(id: number): Promise<boolean> {
    const lenBefore = this.items.length;
    this.items = this.items.filter((c) => c.id !== id);
    return this.items.length < lenBefore;
  }
}
