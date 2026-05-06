# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

---

## Project clone workflow

## clone "2024-05-clever-platform-core" from https://github.com/ZettaMerge/2024-05-clever-platform-core

## "bun i" or "npm i" then "npm audit fix" for windows,

## Do this every time after git pull to make sure all node_modules needed will be installed.

\skillvir-game-core> bun i
\skillvir-universal-helper> bun i
\skillvir-architecture-helper> bun i // for windows "npm i" then "npm audit fix"

# Run

\2024-05-clever-platform-frontend> bun i // for windows "npm i" then "npm audit fix"
\2024-05-clever-platform-frontend> bun run dev

# README - TypeScript Check Before Build เพิ่ม script type-check

โปรเจกต์นี้จำเป็นต้องเช็ค TypeScript ก่อนที่จะทำการ **build** เนื่องจากถ้าไม่เช็ค จะทำให้เกิด **TypeScript error** และไม่สามารถสร้าง **static HTML** ได้

## วิธีการเช็ค TypeScript

หากโปรเจกต์มี script `type-check` ใน `package.json` สามารถใช้คำสั่งนี้ได้เลย:

```bash
npm run type-check

bun run type-check
```

ถ้ายังไม่มี type-check ใน package.json

```
 "scripts": {
    "type-check": "tsc --noEmit",
 }
```

กรณีที่ หาคำสั่ง tsc ไม่เจอ ให้เช็คให้แน่ใจว่า install typescript ในเครื่องแล้ว แบบ global

```bash
npm install -G typescript

```
