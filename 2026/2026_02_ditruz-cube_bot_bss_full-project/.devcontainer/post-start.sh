#!/bin/bash
# post-start.sh — รันทุกครั้งที่ container start

# ตรวจสอบว่า .claude credentials mount ทำงานถูกต้อง
if [ ! -f /home/vscode/.claude/.credentials.json ]; then
  echo "⚠️  Claude credentials not found at /home/vscode/.claude/.credentials.json"
  echo "   Mount อาจไม่ทำงาน — รัน 'claude login' เพื่อ login ใหม่"
fi

# เชื่อม Figma MCP ถ้ายังไม่มี (ข้ามถ้าล้มเหลว)
if command -v claude &>/dev/null; then
  if ! claude mcp list 2>/dev/null | grep -q figma-dev-mode-mcp-server; then
    claude mcp add --transport http figma-dev-mode-mcp-server http://127.0.0.1:3845/mcp 2>/dev/null || true
  fi
fi

# Inject env defaults เข้า settings.local.json (เช็คทีละ key — ไม่ overwrite ค่าที่ user ตั้งเอง)
SETTINGS_LOCAL="/workspaces/project/.claude/settings.local.json"
if [ ! -f "$SETTINGS_LOCAL" ]; then
  echo '{}' > "$SETTINGS_LOCAL"
fi

changed=false
ensure_env_key() {
  local key="$1" value="$2"
  if ! jq -e ".env.\"$key\"" "$SETTINGS_LOCAL" &>/dev/null; then
    jq ".env //= {} | .env.\"$key\" = \"$value\"" \
      "$SETTINGS_LOCAL" > "${SETTINGS_LOCAL}.tmp" && mv "${SETTINGS_LOCAL}.tmp" "$SETTINGS_LOCAL"
    echo "  + env.$key = $value"
    changed=true
  fi
}

ensure_env_key "MAX_MCP_OUTPUT_TOKENS" "75000"
ensure_env_key "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE" "80"

if [ "$changed" = true ]; then
  echo "✅ Updated settings.local.json with missing env defaults"
fi

# Install dotnet-sonarscanner if missing
if ! dotnet tool list --global 2>/dev/null | grep -q dotnet-sonarscanner; then
  echo "📦 Installing dotnet-sonarscanner..."
  dotnet tool install --global dotnet-sonarscanner
fi
