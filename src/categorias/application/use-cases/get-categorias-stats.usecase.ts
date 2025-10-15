import { Inject, Injectable } from '@nestjs/common';
import { PG_DB } from '../../../database/tokens';
import type { DB } from '../../../database/pg';

export interface CategoriaStats {
  id: number;
  nombre: string;
  slug: string;
  color?: string;
  icono?: string;
  posts_count: number;
  published_posts: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  avg_views: number;
}

@Injectable()
export class GetCategoriasStatsUseCase {
  constructor(@Inject(PG_DB) private readonly db: DB) {}

  async execute(): Promise<CategoriaStats[]> {
    const rows = await this.db.query<CategoriaStats>(this.db.sql`
      SELECT * FROM categorias_stats
      ORDER BY total_views DESC
    `);
    return rows;
  }
}
