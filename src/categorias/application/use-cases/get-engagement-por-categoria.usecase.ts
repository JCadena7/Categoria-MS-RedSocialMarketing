import { Inject, Injectable } from '@nestjs/common';
import { PG_DB } from '../../../database/tokens';
import type { DB } from '../../../database/pg';

export interface EngagementPorCategoria {
  id: number;
  nombre: string;
  slug: string;
  color?: string;
  posts_count: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  engagement_rate: number;
}

@Injectable()
export class GetEngagementPorCategoriaUseCase {
  constructor(@Inject(PG_DB) private readonly db: DB) {}

  async execute(): Promise<EngagementPorCategoria[]> {
    const rows = await this.db.query<EngagementPorCategoria>(this.db.sql`
      SELECT * FROM engagement_por_categoria
      ORDER BY engagement_rate DESC
    `);
    return rows;
  }
}
