# Actualización del Módulo de Categorías

## Resumen de Cambios

Se ha actualizado el módulo de categorías para reflejar completamente la estructura de la base de datos definida en `init-db.ts`, incluyendo todos los campos, vistas y triggers relacionados con categorías.

## Cambios en la Estructura de Datos

### 1. Entidad Categoria (`categoria.entity.ts`)

Se agregaron los siguientes campos:

- **`parent_id`** (number | null): Referencia a la categoría padre para jerarquías
- **`posts_count`** (number): Contador automático de posts asociados
- **`is_active`** (boolean): Estado activo/inactivo de la categoría
- **`display_order`** (number): Orden de visualización
- **`created_by`** (number | null): ID del usuario que creó la categoría

### 2. DTOs Actualizados

#### CreateCategoriaDto
- Agregados campos opcionales: `parent_id`, `is_active`, `display_order`, `created_by`
- Valores por defecto: `is_active = true`, `display_order = 0`

#### FindAllCategoriasDto
- Nuevos filtros: `parent_id`, `is_active`
- Nuevas opciones de ordenamiento: `display_order`, `posts_count`
- Ordenamiento por defecto cambiado a `display_order`

### 3. Repositorio Actualizado

El repositorio de Postgres (`postgres-categorias.repository.ts`) ahora:

- Incluye todos los campos nuevos en las operaciones CRUD
- Soporta filtrado por `parent_id` e `is_active`
- Permite ordenar por `display_order` y `posts_count`
- Maneja correctamente valores nulos para `parent_id`

## Nuevos Endpoints (Message Patterns)

### Vistas de Base de Datos

Se agregaron 4 nuevos endpoints que acceden a las vistas creadas en la base de datos:

#### 1. `getCategoriasStats`
Retorna estadísticas completas de cada categoría:
```typescript
{
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
```

#### 2. `getEngagementPorCategoria`
Retorna métricas de engagement por categoría:
```typescript
{
  id: number;
  nombre: string;
  slug: string;
  color?: string;
  posts_count: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  engagement_rate: number; // Porcentaje calculado
}
```

#### 3. `getCategoriasMejorRendimiento`
Retorna categorías ordenadas por score de rendimiento:
```typescript
{
  id: number;
  nombre: string;
  slug: string;
  color?: string;
  posts_count: number;
  avg_views: number;
  avg_likes: number;
  avg_comments: number;
  total_views: number;
  performance_score: number; // Score calculado
}
```

#### 4. `getCategoriasJerarquicas`
Retorna categorías en estructura de árbol jerárquico:
```typescript
{
  ...Categoria,
  children?: CategoriaConHijos[]; // Subcategorías anidadas
}
```

## Triggers de Base de Datos

El módulo aprovecha los siguientes triggers automáticos:

1. **`update_category_posts_count`**: Actualiza automáticamente `posts_count` cuando se asocian/desasocian posts
2. **`prevent_category_deletion_with_posts`**: Previene la eliminación de categorías con posts asociados
3. **`generate_category_slug`**: Genera automáticamente el slug basado en el nombre si no se proporciona
4. **`update_categorias_updated_at`**: Actualiza automáticamente el campo `updated_at`

## Vistas de Base de Datos Utilizadas

1. **`categorias_stats`**: Estadísticas agregadas por categoría
2. **`engagement_por_categoria`**: Métricas de engagement
3. **`categorias_mejor_rendimiento`**: Ranking de categorías por rendimiento

## Uso de Nuevas Funcionalidades

### Crear Categoría con Jerarquía

```typescript
// Categoría padre
const padre = await client.send('createCategoria', {
  nombre: 'Tecnología',
  descripcion: 'Categoría principal de tecnología',
  color: '#3B82F6',
  icono: '💻',
  is_active: true,
  display_order: 1
});

// Subcategoría
const hijo = await client.send('createCategoria', {
  nombre: 'JavaScript',
  descripcion: 'Artículos sobre JavaScript',
  parent_id: padre.id,
  color: '#F7DF1E',
  icono: '⚡',
  is_active: true,
  display_order: 1
});
```

### Filtrar Categorías

```typescript
// Solo categorías raíz (sin padre)
const raices = await client.send('findAllCategorias', {
  parent_id: null,
  is_active: true,
  orderBy: 'display_order',
  order: 'asc'
});

// Subcategorías de una categoría específica
const subcategorias = await client.send('findAllCategorias', {
  parent_id: 5,
  is_active: true
});
```

### Obtener Estadísticas

```typescript
// Estadísticas completas
const stats = await client.send('getCategoriasStats', {});

// Engagement
const engagement = await client.send('getEngagementPorCategoria', {});

// Mejor rendimiento
const topCategorias = await client.send('getCategoriasMejorRendimiento', {});

// Estructura jerárquica
const arbol = await client.send('getCategoriasJerarquicas', {});
```

## Compatibilidad

Todos los cambios son **retrocompatibles**. Los campos nuevos son opcionales y tienen valores por defecto:

- `parent_id`: `null` (categoría raíz)
- `posts_count`: `0` (manejado por trigger)
- `is_active`: `true`
- `display_order`: `0`
- `created_by`: `null`

## Archivos Modificados

1. ✅ `entities/categoria.entity.ts`
2. ✅ `dto/create-categoria.dto.ts`
3. ✅ `dto/update-categoria.dto.ts`
4. ✅ `dto/find-all-categorias.dto.ts`
5. ✅ `domain/repositories/categorias.repository.ts`
6. ✅ `infrastructure/repositories/postgres-categorias.repository.ts`
7. ✅ `application/use-cases/create-categoria.usecase.ts`
8. ✅ `categorias.controller.ts`
9. ✅ `categorias.module.ts`

## Archivos Nuevos

1. ✅ `application/use-cases/get-categorias-stats.usecase.ts`
2. ✅ `application/use-cases/get-engagement-por-categoria.usecase.ts`
3. ✅ `application/use-cases/get-categorias-mejor-rendimiento.usecase.ts`
4. ✅ `application/use-cases/get-categorias-jerarquicas.usecase.ts`

## Próximos Pasos Recomendados

1. **Testing**: Crear tests unitarios e integración para los nuevos endpoints
2. **Documentación API**: Actualizar la documentación de la API con los nuevos endpoints
3. **Validaciones**: Agregar validaciones adicionales para prevenir ciclos en jerarquías
4. **Cache**: Considerar implementar cache para las vistas de estadísticas
5. **Migraciones**: Si hay datos existentes, crear scripts de migración para poblar los nuevos campos
