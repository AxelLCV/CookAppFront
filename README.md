# Weekcook — Frontend

App mobile React + TypeScript + Vite, packagée en app Android via Capacitor.

## Scripts

- `npm run dev` — serveur de développement web (navigateur, pour itérer vite sur l'UI).
- `npm run build` — build de production (`dist/`).
- `npm run lint` — ESLint.
- `npm run storybook` — développement de composants isolés (voir ci-dessous).
- `npm run build-storybook` — build statique de Storybook.
- `npm run generate` — build web + sync Capacitor + compile l'APK Android.
- `npm run cap:sync` — build web + sync Capacitor (sans compiler l'APK).
- `npm run cap:open:android` — ouvre le projet Android dans Android Studio.
- `npm run ota:publish` — build + publie une mise à jour OTA (voir `ota-server/`).

## Développer une page ou un composant

Storybook est le socle pour développer un composant en isolation, sans avoir à naviguer dans toute l'app ni être connecté :

```
npm run storybook
```

Le décorateur global (`.storybook/preview.tsx`) fournit déjà un contexte d'auth mocké, un router (`MemoryRouter`) et l'i18n — les composants utilisant `useAuth()`, `useTranslation()`, `<Link>`/`useNavigate()` fonctionnent directement dans une story sans setup supplémentaire.

## Mises à jour OTA

Le code JS/CSS peut être mis à jour sans repasser par le Play Store ni un nouvel APK, via `ota-server/` (service Railway dédié). Voir `scripts/publish-ota.ps1`.
