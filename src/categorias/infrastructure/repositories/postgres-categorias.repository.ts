import { Inject, Injectable } from '@nestjs/common';
import { Categoria } from '../../entities/categoria.entity';
import { ICategoriasRepository, CreateCategoriaData, UpdateCategoriaData } from '../../domain/repositories/categorias.repository';
import type { DB } from '../../../database/pg';
import { PG_DB } from '../../../database/tokens';

interface CategoriaRow {
  id: number;
  nombre: string;
  descripcion: string;
  slug?: string;
  color?: string;
  icono?: string;
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
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

@Injectable()
export class PostgresCategoriasRepository implements ICategoriasRepository {
  constructor(@Inject(PG_DB) private readonly db: DB) {}

  async create(data: CreateCategoriaData): Promise<Categoria> {
    const slug = data.nombre.toLowerCase().replace(/\s+/g, '-');
    console.log("data", data);
    const [row] = await this.db.query<CategoriaRow>(this.db.sql`
      insert into categorias (nombre, descripcion, slug, color, icono)
      values (${data.nombre}, ${data.descripcion}, ${data.slug}, ${data.color}, ${data.icono})
      returning id, nombre, descripcion, slug, color, icono, created_at, updated_at
    `);
    return mapRow(row);
  }

  async findAll(): Promise<Categoria[]> {
    const rows = await this.db.query<CategoriaRow>(this.db.sql`
      select id, nombre, descripcion, slug, color, icono, created_at, updated_at
      from categorias
      order by id asc
    `);
    return rows.map(mapRow);
  }

  async findOne(id: number): Promise<Categoria | null> {
    const rows = await this.db.query<CategoriaRow>(this.db.sql`
      select id, nombre, descripcion, slug, color, icono, created_at, updated_at
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

    // Nada que actualizar
    if (sets.length === 0) {
      const current = await this.findOne(id);
      return current; // o null si no existe
    }

    sets.push('updated_at = now()');
    const text = `update categorias set ${sets.join(', ')} where id = $${i} returning id, nombre, descripcion, slug, color, icono, created_at, updated_at`;
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
