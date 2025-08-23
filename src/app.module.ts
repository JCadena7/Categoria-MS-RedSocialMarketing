import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [CategoriasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
