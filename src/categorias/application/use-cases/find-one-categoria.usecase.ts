import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Categoria } from '../../entities/categoria.entity';
import { CATEGORIAS_REPOSITORY } from '../../tokens';
import { ICategoriasRepository } from '../../domain/repositories/categorias.repository';
import { db, sql } from '../../../database/pg';

interface PostSummary {
  id: number;
  titulo: string;
  slug: string;
  extracto: string | null;
  imagen_destacada: string | null;
  fecha_publicacion: Date | null;
}

@Injectable()
export class FindOneCategoriaUseCase {
  constructor(
    @Inject(CATEGORIAS_REPOSITORY)
    private readonly repo: ICategoriasRepository,
  ) {}

  async execute(id: number, withPosts = false): Promise<any> {
    const found = await this.repo.findOne(id);
    if (!found) throw new NotFoundException(`Categoria ${id} no encontrada`);
    if (!withPosts) return found;

    const posts = await db.query<PostSummary>(sql`
      SELECT p.id, p.titulo, p.slug, p.extracto, p.imagen_destacada, p.fecha_publicacion
      FROM posts p
      JOIN posts_categorias pc ON p.id = pc.post_id
      JOIN estados_publicacion e ON p.estado_id = e.id
      WHERE pc.categoria_id = ${id} AND e.nombre = 'publicado'
      ORDER BY p.fecha_publicacion DESC
    `);

    return { ...found, posts };
  }
}
