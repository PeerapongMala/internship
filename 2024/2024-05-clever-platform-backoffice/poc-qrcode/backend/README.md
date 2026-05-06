# POC QR-Code backend

This is a simple Express.js-based API that generates and manages unique QR code tokens for users. It can generate a random token, associate it with a user, and allow for retrieval via a QR code scanning endpoint. Tokens are valid for a limited period and automatically expire after the specified time.

## Features

- **Generate QR Code Token**: Creates a unique token for a user or retrieves an existing one.
- **Scan QR Code Token**: Allows scanning of a token to retrieve the associated user information.
- **Token Expiration**: Tokens expire automatically after configuable certain time.
- **Debug Cache**: Allows you to view the current cache of user-token pairs for debugging purposes.

## Installation

You can clone this repository to your local. This example requires `Node.js 18` or higher since it use `express@5`.

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

Start this project

```
npm run start
```
