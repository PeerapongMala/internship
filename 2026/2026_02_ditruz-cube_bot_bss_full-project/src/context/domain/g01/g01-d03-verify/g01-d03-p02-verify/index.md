# g01-d03-p02 — Verify Confirmation

## Overview

หน้ายืนยันการ Verify (Verify Confirmation) — แสดงสรุปจำนวนธนบัตรก่อนกดยืนยัน Verify

ต่อจากหน้า p01 Auto Selling ในขั้นตอนการทำงาน:
1. Auto Selling (p01) → กดปุ่ม "ตรวจสอบ" → มาที่หน้านี้ (p02)
2. ตรวจสอบยอดรวม → กด "Verify" → OTP Confirm modal → API call
3. สำเร็จ → Success modal → redirect กลับ p01
4. ผิดพลาด → Error modal → อยู่หน้าเดิม retry ได้
5. หรือกด "กลับไปหน้า Auto Selling" → กลับ p01

## Status Flow

Approved (16) → **Verify (17)** → SendToCBMS (18)

## Routes

| Type | Route |
|------|-------|
| Frontend URL | `/Verify/VerifyConfirmation` |
| API Base | `api/VerifyTransaction/` (shared with p01) |

## API Endpoints (shared with p01)

| Method | Path | Description |
|--------|------|-------------|
| POST | `Verify` | ยืนยันการ verify (ต้อง OTP) |
| GET | `GetVerifyDetail/{id}` | ดึงรายละเอียด denomination breakdown |

## Database Tables (shared with p01)

- `bss_txn_verify_tran` — Transaction header
- `bss_txn_verify` — Detail / denomination breakdown

## BnType Variants

| Code | Title | Gradient |
|------|-------|----------|
| UF | Verify UNFIT | Blue |
| UC | Verify UNSORT CC | Orange |
| CA | Verify UNSORT CA MEMBER | Green |
| CN | Verify UNSORT CA NON-MEMBER | Purple |

## Figma References

| Component | Figma File | Node | URL |
|-----------|-----------|------|-----|
| Main Page | `r8wLwGvG3I4vYU6SLQ1jec` | `1:9829` | [Figma](https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=1-9829&m=dev) |
| OTP Confirm Modal | `r8wLwGvG3I4vYU6SLQ1jec` | `1:11085` | [Figma](https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=1-11085&m=dev) |
| Success Modal | `LeJRPqvfhVR3AnjdDqIZsn` | `1:10201` | [Figma](https://www.figma.com/design/LeJRPqvfhVR3AnjdDqIZsn/verify-ver-2?node-id=1-10201&m=dev) |
| Error Modal | `LeJRPqvfhVR3AnjdDqIZsn` | `1:10210` | [Figma](https://www.figma.com/design/LeJRPqvfhVR3AnjdDqIZsn/verify-ver-2?node-id=1-10210&m=dev) |

## เอกสาร

| ส่วน | Frontend | Backend |
|------|----------|---------|
| File Map | [frontend/file-map.md](./frontend/file-map.md) | [backend/file-map.md](./backend/file-map.md) |
| Business Logic | [frontend/business-logic.md](./frontend/business-logic.md) | [backend/business-logic.md](./backend/business-logic.md) |
| Changelog | [frontend/changelog.md](./frontend/changelog.md) | [backend/changelog.md](./backend/changelog.md) |

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Documentation scaffold | Done | Template + Figma specs |
| Figma spec: Main page | Done | node-1-9829 (from screenshot + SVG) |
| Figma spec: OTP modal | Done | node-1-11085 (from Figma MCP) |
| Figma spec: Success modal | Done | node-1-10201 (from Figma MCP, file 2) |
| Figma spec: Error modal | Done | node-1-10210 (from Figma MCP, file 2) |
| Frontend View (.cshtml) | Done | Info card + detail table + summary + footer |
| Frontend CSS (main page) | Done | verifyConfirmation.css (SVG-verified) |
| Frontend JS | Done | Mock data mode (USE_MOCK_DATA=true) |
| OTP Confirm modal | Partial | HTML/CSS done, uses custom `.vc-modal-*` layout |
| Success modal | **TODO** | Current code uses wrong Bootstrap layout, needs rewrite to `.vc-modal-*` |
| Error modal | **TODO** | Current code uses wrong Bootstrap layout, needs rewrite to `.vc-modal-*` |
| Backend API | Shared | Reuses p01's VerifyTransaction endpoints |
| API integration | TODO | Set USE_MOCK_DATA=false |
