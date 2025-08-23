export class Categoria {
   // Opcional: generado por la BD
   id?: number;

   // Requeridos
   nombre!: string;
   descripcion!: string;

   // opcional
   slug?: string;
   color?: string;
   icono?: string;

   // Opcionales: timestamps manejados por la BD
   created_at?: Date;
   updated_at?: Date;
}
