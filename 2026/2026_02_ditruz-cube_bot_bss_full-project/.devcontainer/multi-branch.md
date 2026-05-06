# รัน Dev Container หลาย Branch พร้อมกัน

## วิธีที่ 1: Git Worktree (แนะนำ)

ใช้ `.git` เดียว แต่แยก working directory ต่าง branch — ประหยัด disk และ sync remote เดียวกัน

```bash
# อยู่ที่ repo หลัก
cd ~/projects/bss-web

# สร้าง worktree สำหรับ branch อื่น
git worktree add ../bss-web-feature feature-x
git worktree add ../bss-web-hotfix  hotfix-123

# ลบ worktree เมื่อไม่ใช้แล้ว
git worktree remove ../bss-web-feature
```

แล้วเปิด VS Code แต่ละ folder → **Reopen in Container**

## วิธีที่ 2: Clone แยก folder

```bash
git clone <repo-url> ~/projects/bss-web-main
git clone <repo-url> ~/projects/bss-web-feature
cd ~/projects/bss-web-feature && git checkout feature-x
```

## สิ่งที่ต้องระวัง

### Port ชนกัน

Project นี้ใช้ `network_mode: host` → ทุก container ใช้ port เดียวกันกับ host
ถ้ารัน backend ทั้ง 2 container พร้อมกัน port จะชน

**แก้**: รัน app ทีละ container หรือแก้ port ใน `launchSettings.json` ของ container ที่ 2

### Figma MCP

ไม่มีปัญหา — ทุก container connect ไปที่ `host.docker.internal:3845` ตัวเดียวกัน
MCP server เป็น read-only ใช้พร้อมกันได้

### Docker Compose Project Name

Docker Compose ใช้ชื่อ folder เป็น project name
folder ต่างกัน → project name ต่างกัน → container ไม่ชนกัน

```
bss-web-main    → container: bss-web-main-app-1
bss-web-feature → container: bss-web-feature-app-1
```

### Git Submodules

ถ้าใช้ worktree ต้อง init submodule แยกในแต่ละ worktree:

```bash
cd ../bss-web-feature
git submodule update --init --recursive
```
