# Reconsile — Design Reference

## Figma File

- **File Key:** `OAMmUhXjYQKdYn5TAXGnAN`
- **Root Node:** `3652:16991` → `1:11716`

## Node IDs

| Node ID | Name | Purpose | Spec Folder |
|---------|------|---------|-------------|
| `1:17307` | Section 1 | Reconciliation UI — All Types | — |
| `1:18004` | Reconcile - Unfit | **Base layout** | `node-1-18004-reconcile-unfit/` |
| `1:17314` | Reconcile - Unsort CC | CSS variant | — |
| `1:17534` | Reconcile - Unsort CC Member | CSS variant | — |
| `1:17764` | Reconcile - Unsort CC Non Member | CSS variant | — |
| `1:18725` | Section 2 | Input Types | — |
| `1:20244` | Section 3 | Conditions (status states) | — |
| `1:21676` | Section 4 | Edit/Delete flows | — |
| `1:21677` | Edit Summary Reconcile - 02 | Edit modal | `node-1-21677-edit-modal/` |
| `1:22404` | Delete Single Item | Delete modal | `node-1-22404-delete-modal/` |
| `1:22426` | ลบข้อมูลสำเร็จ | Success modal | `node-1-22426-success-modal/` |

## Layout Overview

Full page (1440x900) with vertical layout:

1. **Title** — "Reconciliation {VARIANT}" at top-left (Pridi 600 30px)
2. **Top Panel** — semi-transparent white container, border-radius 16px
   - **Info Card Bar** — 3 items: Header Card (badge), จำนวนมัด (warning), Date/Time (bold)
   - **2-Column Split**:
     - Left: Denomination Table (3 columns)
     - Right: Input Form (radio groups, denom chips, form fields, save button)
3. **Summary Table** — 9-column table with sort icons, action buttons (edit/delete)
4. **Bottom Actions** — Cancel + Reconcile buttons (space-between)
5. **Modals** — Edit (key-value form), Delete (centered confirm), Success, Error, Cancel Reconcile

## Design Token Files

- [design-tokens.md](./design-tokens.md) — colors, fonts, spacing, borders, sizes
- [figma-specs.css](./figma-specs.css) — CSS reference (DO NOT link as stylesheet)

## Per-Node Spec Folders

Each folder contains 5 files: `spec.md`, `screenshot.md`, `design-context.md`, `variables.md`, `styles.css`

- `node-1-18004-reconcile-unfit/` — Base page layout (all sections)
- `node-1-21677-edit-modal/` — Edit modal dialog
- `node-1-22404-delete-modal/` — Delete confirmation dialog
- `node-1-22426-success-modal/` — Success dialog

## SVG Exports

- `Reconcile - Unfit.svg` — Full page export
- `Edit Summary Reconcile - 02.svg` — Edit modal
- `Template - Modal Dialog - OTP.svg` — Delete modal
