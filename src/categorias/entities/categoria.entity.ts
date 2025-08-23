export class Categoria {
   // Opcional: generado por la BD
   id?: number;

   // Requeridos
   nombre!: string;
   descripcion!: string;

   // Opcionales: timestamps manejados por la BD
   created_at?: Date;
   updated_at?: Date;
}
