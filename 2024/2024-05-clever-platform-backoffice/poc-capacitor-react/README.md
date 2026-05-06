# PoC Capacitor with React

This PoC provides a demo of the web app made with React Vite, on top of Tanstack Router and TailwindCSS into the native app (Android and iOS) with Capacitor.js with the goal of testing functionality depending on a mobile platform.

For the demo, we created a simple upload and list of uploaded items workflow by using [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

## Prerequisite
> Before building this project, please follow the environment set up on [Capacitor document](https://capacitorjs.com/docs/getting-started/environment-setup)

## Tools

### Web App Stack
- React Vite ([link](https://vite.dev/guide/))
- Tanstack Router ([link](https://tanstack.com/router/latest))
- TailwindCSS ([link](https://tailwindcss.com/))

### Build Tool
- Capacitor ([link](https://capacitorjs.com))


## Install Dependencies
```
npm install
```

## Running on Web

To start the development on the web.
```
npm run dev
```

## Build Workflow

After you finish development on the web, you have to build the web bundle by
```
npm run build
```

And sync the build bundle into each Android and iOS platform.
```
npm run sync
```

After that, you can run on their emulator by
```
npm run android:start
# or
npm run ios:start
```

---


If you want to do these 3 steps at once. You can do this by
```
npm run android
# or
npm run ios
```
These commands build, sync, and run the emulator for you.
