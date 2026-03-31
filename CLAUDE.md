# مدرسة الأرض - حقيبة معلمة اللغة العربية

## Project Description
A comprehensive Arabic Language Teacher's Guide web app for Earth School (مدرسة الأرض).
Serves as a complete toolkit (حقيبة معلمة) for Arabic language instruction targeting nursery/kindergarten children ages 3-6.

## Tech Stack
- React 19 + Vite
- Tailwind CSS v4 (@tailwindcss/vite)
- Framer Motion for animations
- React Router (HashRouter for GitHub Pages)
- JSON files for all data (static site, no backend)
- Deployed on GitHub Pages

## Language & Layout
- ALL UI text is in Arabic
- RTL layout (dir="rtl" lang="ar")
- Font: IBM Plex Sans Arabic
- Code comments in English
- Use Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) in UI via toArabicNumerals utility

## Design System
- Light color scheme (NOT dark)
- Primary: #2D6A4F (earth green)
- Secondary: #D4A574 (warm gold)
- Accent: #7EC8E3 (sky blue)
- Background: #FEFAE0 (warm white)
- Surface: #FFF8E7 (soft cream)
- Level 1 (green #4CAF50), Level 2 (blue #2196F3), Level 3 (orange #FF9800)

## Naming Conventions
- Components: PascalCase (e.g., ScenarioPage.jsx)
- Data files: kebab-case (e.g., unit-calendar.json)
- Utilities: camelCase (e.g., arabicNumbers.js)
- CSS: Tailwind utility classes

## Curriculum Structure
- 3 levels (المستوى الأول/الثاني/الثالث)
- 12-week unit, 2 sessions/week, 45 min each
- Level 1: ages 3-4, 12 children - phonological/visual awareness + pre-writing
- Level 2: ages 4-5, 6 children - sound analysis, blending, letter positions
- Level 3: ages 5-6, 5 children - reading, connected writing, sentences, linguistics

## Key Commands
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run deploy` - deploy to GitHub Pages
