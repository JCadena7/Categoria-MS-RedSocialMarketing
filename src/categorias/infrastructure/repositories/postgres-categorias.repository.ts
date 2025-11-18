import { Inject, Injectable } from '@nestjs/common';
import { Categoria } from '../../entities/categoria.entity';
import { ICategoriasRepository, CreateCategoriaData, UpdateCategoriaData, FindAllCategoriasOptions, Paginated } from '../../domain/repositories/categorias.repository';
import type { DB } from '../../../database/pg';
import { PG_DB } from '../../../database/tokens';

interface CategoriaRow {
  id: number;
  nombre: string;
  descripcion: string;
  slug: string;
  color?: string;
  icono?: string;
  parent_id?: number | null;
  posts_count?: number;
  is_active?: boolean;
  display_order?: number;
  created_by?: number | null;
  created_at: Date;
  updated_at: Date;
}

function mapRow(r: CategoriaRow): Categoria {
  return {
    id: r.id,
    nombre: r.nombre,
    descripcion: r.descripcion,
    slug: r.slug,
    color: r.color,
    icono: r.icono,
    parent_id: r.parent_id,
    posts_count: r.posts_count,
    is_active: r.is_active,
    display_order: r.display_order,
    created_by: r.created_by,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

@Injectable()
export class PostgresCategoriasRepository implements ICategoriasRepository {
  constructor(@Inject(PG_DB) private readonly db: DB) {}

  async create(data: CreateCategoriaData): Promise<Categoria> {
    const [row] = await this.db.query<CategoriaRow>(this.db.sql`
      insert into categorias (nombre, descripcion, slug, color, icono, parent_id, is_active, display_order, created_by)
      values (${data.nombre}, ${data.descripcion}, ${data.slug}, ${data.color}, ${data.icono}, ${(data as any).parent_id}, ${(data as any).is_active ?? true}, ${(data as any).display_order ?? 0}, ${(data as any).created_by})
      returning id, nombre, descripcion, slug, color, icono, parent_id, posts_count, is_active, display_order, created_by, created_at, updated_at
    `);
    return mapRow(row);
  }

  async findAll(options?: FindAllCategoriasOptions): Promise<Paginated<Categoria>> {
    const page = Math.max(1, Number(options?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options?.limit) || 10));
    const search = options?.search?.trim();
    const slug = options?.slug?.trim();
    const color = options?.color?.trim();
    const allowedOrderBy = new Set(['id', 'nombre', 'created_at', 'updated_at', 'display_order', 'posts_count']);
    const orderBy = allowedOrderBy.has(String(options?.orderBy)) ? String(options?.orderBy) : 'display_order';
    const order = String(options?.order)?.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const conditions: string[] = [];
    const values: any[] = [];
    let i = 1;
    if (search) {
      conditions.push(`(nombre ILIKE $${i} OR COALESCE(descripcion,'') ILIKE $${i + 1})`);
      values.push(`%${search}%`, `%${search}%`);
      i += 2;
    }
    if (slug) {
      conditions.push(`slug = $${i++}`);
      values.push(slug);
    }
    if (color) {
      conditions.push(`color = $${i++}`);
      values.push(color);
    }
    if (typeof options?.parent_id !== 'undefined') {
      if (options.parent_id === null || options.parent_id === 0) {
        conditions.push(`parent_id IS NULL`);
      } else {
        conditions.push(`parent_id = $${i++}`);
        values.push(options.parent_id);
      }
    }
    if (typeof options?.is_active === 'boolean') {
      conditions.push(`is_active = $${i++}`);
      values.push(options.is_active);
    }
    const where = conditions.length ? `where ${conditions.join(' and ')}` : '';

    // total count
    const countText = `select count(*)::int as total from categorias ${where}`;
    const countRows = await this.db.query<{ total: number }>(countText, values);
    const total = countRows[0]?.total ?? 0;

    // page items
    const selText = `select id, nombre, descripcion, slug, color, icono, parent_id, posts_count, is_active, display_order, created_by, created_at, updated_at
      from categorias ${where}
      order by ${orderBy} ${order}
      limit $${i} offset $${i + 1}`;
    const pageValues = [...values, limit, (page - 1) * limit];
    const rows = await this.db.query<CategoriaRow>(selText, pageValues);
    const items = rows.map(mapRow);
    const pages = Math.max(1, Math.ceil(total / limit));
    return { items, total, page, limit, pages };
  }

  async findOne(id: number): Promise<Categoria | null> {
    const rows = await this.db.query<CategoriaRow>(this.db.sql`
      select id, nombre, descripcion, slug, color, icono, parent_id, posts_count, is_active, display_order, created_by, created_at, updated_at
      from categorias
      where id = ${id}
      limit 1
    `);
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async update(id: number, data: UpdateCategoriaData): Promise<Categoria | null> {
    const sets: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (typeof data.nombre === 'string') {
      sets.push(`nombre = $${i++}`);
      values.push(data.nombre);
    }
    if (typeof data.descripcion === 'string') {
      sets.push(`descripcion = $${i++}`);
      values.push(data.descripcion);
    }
    if (typeof (data as any).slug === 'string') {
      sets.push(`slug = $${i++}`);
      values.push((data as any).slug);
    }
    if (typeof (data as any).color === 'string') {
      sets.push(`color = $${i++}`);
      values.push((data as any).color);
    }
    if (typeof (data as any).icono === 'string') {
      sets.push(`icono = $${i++}`);
      values.push((data as any).icono);
    }
    if (typeof (data as any).parent_id !== 'undefined') {
      sets.push(`parent_id = $${i++}`);
      values.push((data as any).parent_id);
    }
    if (typeof (data as any).is_active === 'boolean') {
      sets.push(`is_active = $${i++}`);
      values.push((data as any).is_active);
    }
    if (typeof (data as any).display_order === 'number') {
      sets.push(`display_order = $${i++}`);
      values.push((data as any).display_order);
    }

    // Nada que actualizar
    if (sets.length === 0) {
      const current = await this.findOne(id);
      return current; // o null si no existe
    }

    sets.push('updated_at = now()');
    const text = `update categorias set ${sets.join(', ')} where id = $${i} returning id, nombre, descripcion, slug, color, icono, parent_id, posts_count, is_active, display_order, created_by, created_at, updated_at`;
    values.push(id);

    const rows = await this.db.query<CategoriaRow>(text, values);
    if (rows.length === 0) return null;
    return mapRow(rows[0]);
  }

  async remove(id: number): Promise<boolean> {
    const rows = await this.db.query<{ id: number }>(this.db.sql`
      delete from categorias where id = ${id} returning id
    `);
    return rows.length > 0;
  }
}
