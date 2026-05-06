# POC QR-Code app

This is a simple React + Typescript + Vite app that generates and manages unique QR code tokens for users. It can generate a random token, associate it with a user, and allow for retrieval via a QR code scanning endpoint. Tokens are valid for a limited period and automatically expire after the specified time.

## Features

- **Generate QR Code Token**: Creates a unique token for a user or retrieves an existing one.
- **Scan QR Code Token**: Allows scanning of a token to retrieve the associated user information.
- **Token Expiration**: Tokens expire automatically after configuable certain time.
- **Debug Cache**: Allows you to view the current cache of user-token pairs for debugging purposes.

## Installation

You can clone this repository to your local. This app required you to have POC QR-Code backend running, and ensure that you the `BACKEND_URL` in `App.tsx` is an endpoint to backend.

Install dependencies

```
npm install
```

Start on dev mode

```
npm run dev
```

Build this project

```
npm run build
```
