# YOLO Mode — ข้าม Permission Prompts ใน Dev Container

## ทำไมถึงทำได้ใน Dev Container

Dev Container รันอยู่ใน Docker อยู่แล้ว — ถือเป็น sandbox ที่แยกจาก host machine:

- **Filesystem แยก** — Container มี filesystem ของตัวเอง ลบไฟล์ในนี้ไม่กระทบ host
- **Network แยก** — ใช้ `network_mode: host` ก็จริง แต่ process ใน container ไม่สามารถเข้าถึง host filesystem
- **Disposable** — ถ้าพังก็ rebuild container ใหม่ได้เสมอ

ดังนั้นการให้ Claude Code bypass permission prompts ใน container จึงมีความเสี่ยงต่ำ — ต่างจากบน host machine ที่อาจลบไฟล์สำคัญได้

---

## วิธีที่ 1: CLI Flag (ต่อ session)

```bash
# เริ่ม session ใหม่แบบ bypass
claude --dangerously-skip-permissions

# ต่อ session เดิมแบบ bypass (ไม่ต้องเริ่มใหม่)
claude --continue --dangerously-skip-permissions

# resume conversation ที่ระบุ
claude --resume <conversation-id> --dangerously-skip-permissions
```

- ข้าม permission prompts ทั้งหมดในรอบนั้น
- ปิด terminal = หมดผล ต้องใส่ใหม่ทุกครั้ง
- `--continue` ต่อ conversation ล่าสุด, `--resume` เลือก conversation ที่ต้องการ
- เหมาะกับการใช้ชั่วคราว หรือต่อ session ที่ค้างไว้

---

## วิธีที่ 2: settings.local.json (ถาวรใน container)

ตั้งค่า `defaultMode` ใน `.claude/settings.local.json` เพื่อ bypass อัตโนมัติทุกครั้งที่เปิด Claude:

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}
```

ไฟล์นี้อยู่ใน `.gitignore` อยู่แล้ว → ไม่ถูก commit, ไม่กระทบ teammate

### ตั้งค่าด้วยมือ

แก้ไฟล์ `.claude/settings.local.json` ในโปรเจกต์โดยตรง หรือใช้ `jq`:

```bash
SETTINGS_LOCAL="/workspaces/project/.claude/settings.local.json"
[ ! -f "$SETTINGS_LOCAL" ] && echo '{}' > "$SETTINGS_LOCAL"

jq '.permissions //= {} | .permissions.defaultMode = "bypassPermissions"' \
  "$SETTINGS_LOCAL" > "${SETTINGS_LOCAL}.tmp" && mv "${SETTINGS_LOCAL}.tmp" "$SETTINGS_LOCAL"
```

---

## วิธีที่ 3: Granular Allow (middle ground)

ไม่ bypass ทั้งหมด แต่ allow เฉพาะ tools ที่ใช้บ่อย — ยังมี prompt สำหรับ tools อื่น:

```json
{
  "permissions": {
    "allow": [
      "Bash(*):",
      "Read",
      "Edit",
      "Write",
      "Glob",
      "Grep",
      "WebFetch",
      "WebSearch",
      "mcp__figma-dev-mode-mcp-server"
    ]
  }
}
```

ใส่ใน `.claude/settings.local.json` เช่นกัน วิธีนี้เหมาะถ้าต้องการ:
- ให้ Bash รันได้อิสระ แต่ยัง prompt สำหรับ tools พิเศษบางตัว
- ลดความเสี่ยงจาก tools ที่ไม่คุ้นเคย

---

## Automate ผ่าน post-start.sh

เพิ่ม function ใน `post-start.sh` เพื่อ inject `defaultMode` อัตโนมัติเมื่อ container start:

```bash
# inject bypass permissions (เฉพาะ dev container เท่านั้น)
ensure_permissions_mode() {
  local mode="$1"
  if ! jq -e '.permissions.defaultMode' "$SETTINGS_LOCAL" &>/dev/null; then
    jq '.permissions //= {} | .permissions.defaultMode = "'"$mode"'"' \
      "$SETTINGS_LOCAL" > "${SETTINGS_LOCAL}.tmp" && mv "${SETTINGS_LOCAL}.tmp" "$SETTINGS_LOCAL"
    echo "  + permissions.defaultMode = $mode"
    changed=true
  fi
}

ensure_permissions_mode "bypassPermissions"
```

วางไว้หลัง `ensure_env_key` calls ที่มีอยู่แล้ว — ใช้ pattern เดียวกัน (เช็คก่อน inject, ไม่ overwrite ค่าที่ user ตั้งเอง)

---

## สิ่งที่ต้องระวัง

### permissions.deny ยังทำงานเสมอ

แม้จะ bypass permissions แล้ว `permissions.deny` rules ใน `settings.json` ยังบังคับอยู่:

```json
{
  "permissions": {
    "deny": [
      "Bash(rm -rf /)",
      "Bash(git push --force)"
    ]
  }
}
```

ใช้ deny list เพื่อป้องกัน command อันตรายเป็น safety net เพิ่มเติม

### ไม่ควรใช้กับ repo ที่ไม่เชื่อถือ

Bypass permissions หมายความว่า Claude จะรัน command ทุกอย่างโดยไม่ถาม — ถ้า repo มี prompt injection ใน README, CLAUDE.md, หรือ issue comments อาจถูกใช้โจมตีได้

### ใช้เฉพาะใน container เท่านั้น

**อย่าตั้ง `bypassPermissions` บน host machine** — ถ้า Claude ลบไฟล์หรือรัน command ผิดบน host จะกู้คืนยาก ใน container rebuild ใหม่ได้เสมอ

---

## วิธีปิด / Revert

### ลบ key ออกจาก settings.local.json

```bash
SETTINGS_LOCAL="/workspaces/project/.claude/settings.local.json"
jq 'del(.permissions.defaultMode)' \
  "$SETTINGS_LOCAL" > "${SETTINGS_LOCAL}.tmp" && mv "${SETTINGS_LOCAL}.tmp" "$SETTINGS_LOCAL"
```

### หรือกลับ plan mode ผ่าน CLI

```bash
claude --permission-mode plan
```

### หรือลบไฟล์ทิ้งทั้งหมด

```bash
rm /workspaces/project/.claude/settings.local.json
```

Container จะสร้างไฟล์ใหม่ (ด้วยค่า default) เมื่อ restart ผ่าน `post-start.sh`
