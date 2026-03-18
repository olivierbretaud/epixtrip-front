# Mon Projet Next.js

## Stack technique
- Next.js 15+ (App Router)
- TypeScript (strict: true)
- Tailwind CSS v4 + SCSS (sass)
- shadcn/ui
- biome

## Structure des dossiers
- `src/app/` — Routes App Router
- `src/components/` — Composants UI
- `src/lib/` — Fonctions utilitaires
- `src/types/` — Définitions TypeScript

## Règles de code
- Tous les composants doivent être en TypeScript
- Pas de types `any`
- Préférer `type` à `interface`
- Server Components par défaut ; n'ajouter `"use client"` que si nécessaire

## Styles
- Les fichiers de style peuvent être en `.css` ou `.module.scss`
- `@apply` est supporté dans les `.module.scss` (PostCSS + `@tailwindcss/postcss` le gère)
- Toujours ajouter `@reference` en tête de chaque `.module.scss` pointant vers `globals.css` (obligatoire pour Turbopack et le thème custom)
- Exemple d'usage dans un module SCSS :
  ```scss
  @reference "../../app/globals.css"; /* chemin relatif vers globals.css */

  .btn {
    @apply bg-primary text-primary-foreground px-4 py-2 rounded-md;
  }
  ```

## Interdictions
- Pas de code en dehors de `src/`
- Pas de CSS-in-JS (utiliser Tailwind ou SCSS modules)
- Pas de `console.log` dans le code committé
