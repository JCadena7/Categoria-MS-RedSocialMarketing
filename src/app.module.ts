import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, CategoriasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
