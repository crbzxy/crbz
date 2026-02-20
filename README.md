# Carlos Boyzo - Portfolio Personal

Portfolio personal minimalista y bien estructurado, construido con Next.js 15, React 19, TypeScript y Tailwind CSS.

## 🏗️ Arquitectura

El proyecto sigue los principios de **Clean Architecture** y **Atomic Design**, organizando el código en capas claras y componentes reutilizables.

### Estructura de Carpetas

```
/src
  /types              # Tipos TypeScript compartidos
  /constants          # Constantes (persona, rutas, fuentes)
  /components
    /atoms            # Componentes básicos (Button, Link, Badge, Icon, Text)
    /molecules        # Composiciones simples (ContactLink, SkillBadge, Section)
    /organisms        # Componentes complejos (Header, Footer, Hero, About, Skills, Contact)
    /templates        # Layouts (PageLayout)
  /utils              # Utilidades (cn helper para className)
  /hooks              # Hooks personalizados (vacío por ahora)

/app
  layout.tsx          # Layout root de Next.js
  page.tsx            # Página principal (Home)
  services/page.tsx   # Página de servicios
  blog/page.tsx       # Página de blog (placeholder)
  globals.css         # Estilos globales
```

## 🎨 Atomic Design

Los componentes están organizados siguiendo la metodología Atomic Design:

- **Atoms**: Componentes básicos e indivisibles (Button, Link, Badge, Icon, Text)
- **Molecules**: Composiciones de atoms (ContactLink, SkillBadge, Section)
- **Organisms**: Componentes complejos que forman secciones (Header, Footer, Hero, About, Skills, Contact)
- **Templates**: Layouts que organizan organisms (PageLayout)

## 📝 Cómo Agregar Contenido

### Modificar Información Personal

Edita el archivo `src/constants/person.ts`:

```typescript
export const person: Person = {
  name: 'Tu Nombre',
  title: 'Tu Título',
  description: 'Tu descripción',
  email: 'tu@email.com',
  experience: 5, // años de experiencia
};

export const socialLinks: SocialLink[] = [
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/tu-perfil',
    icon: 'linkedin',
    label: 'Perfil de LinkedIn',
  },
  // ... más enlaces
];

export const skills: Skill[] = [
  { name: 'React', category: 'Development' },
  // ... más habilidades
];
```

### Agregar una Nueva Ruta

1. Edita `src/constants/routes.ts` para agregar la ruta al menú
2. Crea la página en `app/nueva-ruta/page.tsx`
3. Usa el template `PageLayout`:

```typescript
import { PageLayout } from '@/src/components/templates/PageLayout';

export default function NuevaRutaPage() {
  return (
    <PageLayout>
      {/* Tu contenido aquí */}
    </PageLayout>
  );
}
```

### Agregar un Nuevo Componente Atómico

1. Crea el archivo en `src/components/atoms/TuComponente.tsx`
2. Sigue el patrón de los componentes existentes
3. Usa TypeScript estricto y agrega accesibilidad (ARIA, focus states)
4. Exporta el componente:

```typescript
export interface TuComponenteProps {
  // props tipadas
}

export function TuComponente({ ...props }: TuComponenteProps) {
  return (
    // JSX
  );
}
```

### Agregar un Nuevo Icono

Edita `src/components/atoms/Icon.tsx`:

1. Agrega el nombre del icono al tipo `IconName`
2. Agrega el path SVG en el objeto `iconPaths`

## 🚀 Scripts Disponibles

```bash
npm run dev        # Inicia el servidor de desarrollo
npm run build      # Construye la aplicación para producción
npm run start      # Inicia el servidor de producción
npm run lint       # Ejecuta ESLint
npm run typecheck  # Verifica tipos TypeScript sin compilar
```

## 🛠️ Tecnologías

- **Next.js 15.5.9** - Framework React con App Router
- **React 19** - Biblioteca UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 3.4** - Estilos utility-first
- **@tailwindcss/typography** - Plugin para estilos de tipografía

## 📦 Dependencias Principales

- `clsx` y `tailwind-merge` - Helpers para combinar clases de Tailwind
- `gray-matter`, `remark`, `unified` - Para procesamiento de Markdown (preparado para blog futuro)

## 🎯 Principios de Diseño

1. **Minimalismo**: Solo lo esencial, sin funcionalidades complejas
2. **TypeScript Estricto**: Todo tipado, sin `any`
3. **Server Components**: Por defecto, Client solo cuando necesario
4. **Accesibilidad**: ARIA labels, focus states, navegación por teclado
5. **Performance**: Sin cálculos pesados, sin re-renders innecesarios
6. **Clean Code**: Código limpio, bien organizado, fácil de mantener

## 📚 Convenciones

### Naming

- Componentes: PascalCase (`Button.tsx`, `ContactLink.tsx`)
- Archivos de tipos: camelCase (`index.ts`, `person.ts`)
- Hooks: camelCase con prefijo `use` (`useScroll.ts`)

### Imports

- Usa paths absolutos: `@/src/components/...`
- Agrupa imports: externos → internos → relativos

### Componentes

- Server Components por defecto
- Client Components solo cuando uses hooks o eventos del navegador
- Tipa todas las props explícitamente
- Agrega accesibilidad (ARIA, focus states)

## 🔧 Configuración

### TypeScript

El proyecto usa TypeScript estricto. Configuración en `tsconfig.json`:

- `strict: true`
- Paths configurados: `@/*` y `@/src/*`

### Tailwind

Configuración en `tailwind.config.ts`:

- Fuentes: Roboto Condensed (sans) y Roboto Mono (mono)
- Plugin de tipografía habilitado
- Modo oscuro soportado

## 🌐 Producción (carlosboyzo.com)

### Variables de entorno

Copia `.env.example` a `.env.local` y ajusta si hace falta:

```bash
cp .env.example .env.local
```

- **`NEXT_PUBLIC_SITE_URL`**: URL pública del sitio (p. ej. `https://carlosboyzo.com`). Se usa en metadata, Open Graph y enlaces canónicos. Si no se define, se usa `https://carlosboyzo.com` por defecto.

### Optimizaciones aplicadas

- **Metadata y SEO**: `metadataBase`, Open Graph, keywords y descripción para redes y buscadores.
- **Headers de seguridad**: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` en `next.config.ts`.
- **Code splitting**: Secciones below-the-fold (About, Services, Skills, Contact) cargadas con `dynamic()` para reducir el JS inicial.
- **React Strict Mode**: Activado en producción.

### Deploy

```bash
npm run build
npm run start
```

En Vercel (o similar), configura `NEXT_PUBLIC_SITE_URL` con la URL de producción. El build ejecuta `next build`; si quieres que el lint bloquee el deploy, quita o cambia `eslint.ignoreDuringBuilds` en `next.config.ts`.

## 📖 Próximos Pasos

- [ ] Agregar sistema de blog con Markdown
- [ ] Implementar modo oscuro toggle
- [ ] Agregar animaciones sutiles
- [ ] Optimizar imágenes
- [ ] Agregar tests

## 📄 Licencia

Privado - Todos los derechos reservados
