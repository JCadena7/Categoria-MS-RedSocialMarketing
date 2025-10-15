import { Inject, Injectable } from '@nestjs/common';
import { PG_DB } from '../../../database/tokens';
import type { DB } from '../../../database/pg';

export interface CategoriaMejorRendimiento {
  id: number;
  nombre: string;
  slug: string;
  color?: string;
  posts_count: number;
  avg_views: number;
  avg_likes: number;
  avg_comments: number;
  total_views: number;
  performance_score: number;
}

@Injectable()
export class GetCategoriasMejorRendimientoUseCase {
  constructor(@Inject(PG_DB) private readonly db: DB) {}

  async execute(): Promise<CategoriaMejorRendimiento[]> {
    const rows = await this.db.query<CategoriaMejorRendimiento>(this.db.sql`
      SELECT * FROM categorias_mejor_rendimiento
      ORDER BY performance_score DESC
    `);
    return rows;
  }
}
