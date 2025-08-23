import { Injectable } from '@nestjs/common';
import { Categoria } from '../../entities/categoria.entity';
import { ICategoriasRepository, CreateCategoriaData, UpdateCategoriaData, FindAllCategoriasOptions, Paginated } from '../../domain/repositories/categorias.repository';

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
      slug: (data as any).slug,
      color: (data as any).color,
      icono: (data as any).icono,
      created_at: now,
      updated_at: now,
    };
    this.items.push(categoria);
    return categoria;
  }

  async findAll(options?: FindAllCategoriasOptions): Promise<Paginated<Categoria>> {
    const page = Math.max(1, Number(options?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options?.limit) || 10));
    const search = options?.search?.toLowerCase().trim();
    const slug = options?.slug?.trim();
    const color = options?.color?.trim();
    const orderBy = (options?.orderBy ?? 'id') as keyof Categoria;
    const order = (options?.order ?? 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';

    let data = [...this.items];
    if (search) {
      data = data.filter((c) =>
        c.nombre.toLowerCase().includes(search) || (c.descripcion ?? '').toLowerCase().includes(search),
      );
    }
    if (slug) data = data.filter((c) => c.slug === slug);
    if (color) data = data.filter((c) => c.color === color);

    const total = data.length;
    data.sort((a: any, b: any) => {
      const av = a[orderBy];
      const bv = b[orderBy];
      if (av == null && bv == null) return 0;
      if (av == null) return order === 'asc' ? -1 : 1;
      if (bv == null) return order === 'asc' ? 1 : -1;
      if (av < bv) return order === 'asc' ? -1 : 1;
      if (av > bv) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const start = (page - 1) * limit;
    const items = data.slice(start, start + limit);
    const pages = Math.max(1, Math.ceil(total / limit));
    return { items, total, page, limit, pages };
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
