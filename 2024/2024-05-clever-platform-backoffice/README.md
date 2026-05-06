## Project clone workflow

## "bun i" or "npm i" then "npm audit fix" for windows, if some error occurs.

## Do this after git pull to make sure all node_modules needed will be installed.

\v1> bun i

# Run

\v1> bun run dev

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

# BUILD

Linux only. run by `build-<branch>`. Now have 4 file

- build-dev.sh
- build-prod.sh
- build-staging.sh
- build-testing.sh

## How to run script

```bash
cd ./v1

bash build-dev.sh <SSH_KEY_PATH> <HOST_USERNAME> <HOST_IP> <HOST_IP: OPTIONAL>
```

Example

```bash
cd ./v1

bash build-dev.sh ~/.ssh/my_ssh_key myuser 127.0.0.0 22


```
