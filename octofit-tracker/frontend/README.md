# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Environment variables

The app builds its API base URL from `VITE_CODESPACE_NAME`. Create a `.env.local` file
(see `.env.local.example`) with:

```
VITE_CODESPACE_NAME=your-codespace-name
```

When running in a GitHub Codespace, this should match the `$CODESPACE_NAME` value used by
the backend so requests target `https://$VITE_CODESPACE_NAME-8000.app.github.dev/api/...`.
If unset, the app falls back to `http://localhost:8000/api`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
