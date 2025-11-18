export class Categoria {
   // Opcional: generado por la BD
   id?: number;

   // Requeridos
   nombre!: string;
   descripcion!: string;
   slug!: string;

   // Opcionales
   color?: string;
   icono?: string;
   parent_id?: number | null;
   posts_count?: number;
   is_active?: boolean;
   display_order?: number;
   created_by?: number | null;

   // Opcionales: timestamps manejados por la BD
   created_at?: Date;
   updated_at?: Date;
}
