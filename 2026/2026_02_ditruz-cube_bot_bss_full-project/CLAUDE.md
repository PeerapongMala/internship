# Figma MCP — Always Use Subagent

When calling any Figma MCP tool (`get_screenshot`, `get_design_context`, `get_variable_defs`, `get_metadata`), ALWAYS delegate to a Task subagent. Never call Figma MCP tools directly from the main conversation.

This prevents large MCP responses from consuming the main context window.

Example:
```
Task(subagent_type="general-purpose", prompt="Use get_design_context on node 123:456 and summarize the layout, colors, and spacing")
```

The subagent should return a concise summary — not the raw MCP response.

## TEMPORARY: Figma MCP Deep Analysis DISABLED

เพื่อประหยัด rate limit — **ปิด Autonomous Deep Analysis ชั่วคราว** (Phase 1.3, 1.4):
- ห้าม AI เรียก `get_metadata` แล้วแตก subagent ซ้อนเรียก `get_design_context` ทุก component อัตโนมัติ
- ห้าม AI วิเคราะห์หน้าจอเองแล้วเรียก MCP หลายรอบ (nested analysis)
- **ยังเรียก Figma MCP ได้ปกติ** สำหรับ: ดึง spec เฉพาะ node ที่ต้องการ, verify หลัง implement, user สั่งโดยตรง
- ถ้าต้องการ spec หลาย component → **ถาม user ก่อน** ว่าจะให้ดึง node ไหนบ้าง แทนที่จะ auto-discover

# Design Check Instructions

When implementing any UI page from Figma, follow the instructions in `/workspaces/project/design-check-instructions.md`. Key rules:

1. **ALWAYS scan global CSS** (`all.css`, `Style.css`) before writing any CSS
2. **ALWAYS call Figma MCP** (`get_design_context`, `get_variable_defs`) before writing CSS — never guess colors/fonts/spacing
3. **SVG/icons**: Check for existing SVG files from Figma first (`Glob **/*.svg`), use `<img>` + data URI in tables
4. **Large Figma nodes**: NEVER implement a full page in one go — use `get_metadata` to see structure, split into tasks per section, implement each section thoroughly before moving on
5. **2-round rule**: If a CSS fix doesn't work after 2 attempts, change approach entirely
6. **Browser cache**: If code is confirmed changed but user still sees old version, suggest hard refresh first
7. **Figma MCP via subagent ONLY** — never call Figma MCP from main context (see Phase 5)
8. **Save design docs** — always save tokens/specs to `design/` folder (see Phase 6)
9. **Parallel subagents for issues** — when user reports multiple issues, research via parallel subagents then implement in main context (see Phase 7)
10. **(DISABLED) Autonomous Figma Analysis** — ปิดชั่วคราวเพื่อประหยัด rate limit. ถ้าได้ Figma node IDs → ถาม user ว่าจะให้ดึง spec node ไหนบ้าง แทนที่จะ auto-discover ทั้งหมด

# Compact Instructions

When compacting, preserve:
- Current domain page being implemented (g01-dXX-pXX path)
- Active Figma node IDs being worked on
- Design tokens extracted so far
- Backend/frontend file paths already identified
- Current task progress and pending steps
