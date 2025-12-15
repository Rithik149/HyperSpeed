# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
easy-send
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ assets
│  ├─ BackEnd
│  │  ├─ index.js
│  │  └─ user_temps
│  │     └─ uploads
│  │        └─ 6f58892282272bd61f8386b02a8d9599
│  ├─ FrontEnd
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  └─ external
│  │     ├─ fileup.jsx
│  │     ├─ Hyperspeed.css
│  │     └─ Hyperspeed.jsx
│  ├─ main.css
│  └─ main.jsx
├─ user_temps
│  └─ uploads
│     └─ 6b8f6e0574f3796997f7defff5216b8e
└─ vite.config.js

```