# Popup / Modal Inventory - Reconciliation Transaction (UNFIT)

> Source: Figma Section Node `2:41247` ("Popup 20251105")
> Page: `g01-d02-p01-transcation` (Reconciliation Transaction)
> Note: One popup type can have multiple state nodes (1 popup = N nodes).

---

## Summary

| # | Popup Type                            | Flow        | State Count | Node IDs                                            |
|---|---------------------------------------|-------------|-------------|-----------------------------------------------------|
| 1 | Edit Header Card (Form)               | Edit Single | 2 nodes     | `2:41257`, `2:41649`                                |
| 2 | Edit Header Card - Review/Confirm     | Edit Single | 3 nodes     | `2:41680`, `2:41761`, `2:41846`                     |
| 3 | Edit Header Card - Review/Confirm     | Edit Multi  | 3 nodes     | `2:41300`, `2:41414`, `2:41532`                     |
| 4 | Edit Header Card - Success            | Edit Single | 1 node      | `2:41670`                                           |
| 5 | Edit Header Card - Success            | Edit Multi  | 1 node      | `2:41248`                                           |
| 6 | Delete Data (Confirm Table)           | Delete      | 2 nodes     | `2:42573`, `2:42697`                                |
| 7 | Delete Data - Success                 | Delete      | 1 node      | `2:42837`                                           |
| 8 | Delete Data - Print Report            | Delete      | 1 node      | `2:42846`                                           |
| 9 | Delete Multiple Data (Confirm Table)  | Delete Multi| 3 nodes     | `2:42876`, `2:43017`, `2:43158`                     |
|10 | Delete Multiple Data - Success        | Delete Multi| 1 node      | `2:43299`                                           |
|11 | Delete Multiple Data - Print Report   | Delete Multi| 1 node      | `2:43308`                                           |
|12 | Warning / Alert (Error Case)          | Flow Overview| 1 node     | `2:40592` (in section `2:39725`)                    |

**Total: 19 popup frame nodes across 12 popup types.**

---

## Detailed Breakdown

### POPUP TYPE 1: Edit Header Card - Form Dialog

Small modal dialog (560-600px wide) with form fields for editing Header Card data.

| State | Frame Name                                                | Node ID    | Modal Type    | Title Text                    |
|-------|-----------------------------------------------------------|------------|---------------|-------------------------------|
| A     | Reconciliation Transaction / Popup / Edit HeaderCard - 7  | `2:41257`  | Modal Dialog  | แก้ไขข้อมูล Header Card       |
| B     | Reconciliation Transaction / Popup / Edit - 7             | `2:41649`  | Modal Dialog  | แก้ไขข้อมูล Header Card       |

- **State A** (`2:41257`): Edit form with 6 fields (3 columns x 2 rows), including select dropdowns and text inputs. Cancel + Confirm buttons.
- **State B** (`2:41649`): Edit form with 2 fields (select + readonly text). Cancel + Confirm buttons. Appears to be a simpler single-item edit variant.

---

### POPUP TYPE 2: Edit Header Card - Review/Confirm (Single Item Flow)

Large OTP-template modal dialog (1280px wide) for reviewing edit changes before OTP verification.

| State | Frame Name                                                | Node ID    | Modal Type                  | Title Text             |
|-------|-----------------------------------------------------------|------------|-----------------------------|------------------------|
| A     | Reconciliation Transaction / Popup / Edit - 9             | `2:41680`  | Template - Modal Dialog - OTP | ตรวจสอบการแก้ไข       |
| B     | Reconciliation Transaction / Popup / Edit - 10            | `2:41761`  | Template - Modal Dialog - OTP | ตรวจสอบการแก้ไข       |
| C     | Reconciliation Transaction / Popup / Edit - 11            | `2:41846`  | Template - Modal Dialog - OTP | ตรวจสอบการแก้ไข       |

- Title: "ตรวจสอบการแก้ไข" (Review Edit)
- Subtitle: "เตรียมแก้ไขข้อมูล 1 รายการ" (Prepare to edit 1 item)
- Contains: data review table, "ยืนยันการแก้ไข" (Confirm Edit) section with textarea and select inputs, Cancel + Confirm buttons.
- **States A/B/C** represent progressive steps in the OTP confirmation flow (e.g., initial review, OTP entry, final confirm).

---

### POPUP TYPE 3: Edit Header Card - Review/Confirm (Multiple Items Flow)

Large OTP-template modal dialog (1280px wide) for reviewing multiple edit changes.

| State | Frame Name                                                | Node ID    | Modal Type                  | Title Text             |
|-------|-----------------------------------------------------------|------------|-----------------------------|------------------------|
| A     | Reconciliation Transaction / Popup / Edit HeaderCard - 8  | `2:41300`  | Template - Modal Dialog - OTP | ตรวจสอบการแก้ไข       |
| B     | Reconciliation Transaction / Popup / Edit HeaderCard - 9  | `2:41414`  | Template - Modal Dialog - OTP | ตรวจสอบการแก้ไข       |
| C     | Reconciliation Transaction / Popup / Edit HeaderCard - 10 | `2:41532`  | Template - Modal Dialog - OTP | ตรวจสอบการแก้ไข       |

- Title: "ตรวจสอบการแก้ไข" (Review Edit)
- Subtitle: "เตรียมแก้ไขข้อมูล 2 รายการ" (Prepare to edit 2 items)
- Contains: data review table (2 rows), "ยืนยันการแก้ไข" (Confirm Edit) section, Cancel + Confirm buttons.
- **States A/B/C** represent progressive steps in the OTP confirmation flow.

---

### POPUP TYPE 4: Edit Header Card - Success Alert (Single Item)

Small alert dialog (560px wide) confirming successful edit.

| State | Frame Name                                                | Node ID    | Modal Type   | Title Text |
|-------|-----------------------------------------------------------|------------|--------------|------------|
| A     | Reconciliation Transaction / Popup / Edit - 8             | `2:41670`  | Modal Alert  | สำเร็จ     |

- Icon: Green checkmark (success).
- Message: "แก้ไขข้อมูล Hearder Card สำเร็จ" (Edit Header Card data successful).
- Single OK/Close button.

---

### POPUP TYPE 5: Edit Header Card - Success Alert (Multiple Items)

Small alert dialog (560px wide) confirming successful edit of multiple items.

| State | Frame Name                                                | Node ID    | Modal Type   | Title Text |
|-------|-----------------------------------------------------------|------------|--------------|------------|
| A     | Reconciliation Transaction / Popup / Edit HeaderCard - 6  | `2:41248`  | Modal Alert  | สำเร็จ     |

- Icon: Green checkmark (success).
- Message: "แก้ไขข้อ Header Card สำเร็จ" (Edit Header Card successful).
- Single OK/Close button.

---

### POPUP TYPE 6: Delete Data - Confirm Table

Large OTP-template modal dialog for confirming deletion of a single Header Card.

| State | Frame Name                                                | Node ID    | Modal Type                  | Title Text  |
|-------|-----------------------------------------------------------|------------|-----------------------------|-------------|
| A     | Reconciliation Transaction / Popup / Delete - 5           | `2:42573`  | Template - Modal Dialog - OTP | ลบข้อมูล   |
| B     | Reconciliation Transaction / Popup / Delete - 6           | `2:42697`  | Template - Modal Dialog - OTP | Reconfirm ลบข้อมูล |

- **State A** (`2:42573`): Initial delete confirmation. Title: "ลบข้อมูล" (Delete Data). Shows a table of Header Cards selected for deletion with instruction "เลือกรายการ Header Card เพื่อทำการลบข้อมูล". Cancel + Confirm buttons.
- **State B** (`2:42697`): Reconfirmation step. Title: "Reconfirm ลบข้อมูล" (Reconfirm Delete Data). Similar table layout. Cancel + Confirm buttons.

---

### POPUP TYPE 7: Delete Data - Success Alert

Small alert dialog (560px wide) confirming successful deletion.

| State | Frame Name                                                | Node ID    | Modal Type   | Title Text |
|-------|-----------------------------------------------------------|------------|--------------|------------|
| A     | Reconciliation Transaction / Popup / Delete - 7           | `2:42837`  | Modal Alert  | สำเร็จ     |

- Icon: Green checkmark (success).
- Message: "ลบข้อมูลสำเร็จ" (Delete data successful).
- Single OK/Close button.

---

### POPUP TYPE 8: Delete Data - Print Cancel Reconcile Report

Full-screen modal dialog (1346px wide) showing a printable report after deletion.

| State | Frame Name                                                | Node ID    | Modal Type    | Title Text                       |
|-------|-----------------------------------------------------------|------------|---------------|----------------------------------|
| A     | Reconciliation Transaction / Popup / Delete - 8           | `2:42846`  | Modal Dialog  | Print Cancel Reconcile Report    |

- Sub-header: "Branch Summary Report"
- Contains: report image/preview area with financial data table.
- Buttons: Cancel/Close + Print/Export.
- Includes scrollbar UI element.

---

### POPUP TYPE 9: Delete Multiple Data - Confirm Table

Large OTP-template modal dialog for confirming deletion of multiple Header Cards.

| State | Frame Name                                                   | Node ID    | Modal Type                  | Title Text              |
|-------|--------------------------------------------------------------|------------|-----------------------------|-------------------------|
| A     | Reconciliation Transaction / Popup / Delete Multiple - 6     | `2:42876`  | Template - Modal Dialog - OTP | ลบข้อมูล               |
| B     | Reconciliation Transaction / Popup / Delete Multiple - 7     | `2:43017`  | Template - Modal Dialog - OTP | ลบข้อมูล               |
| C     | Reconciliation Transaction / Popup / Delete Multiple - 8     | `2:43158`  | Template - Modal Dialog - OTP | Reconfirm ลบข้อมูล     |

- **State A** (`2:42876`): Initial multi-delete confirmation. Title: "ลบข้อมูล". Table with multiple Header Cards. Cancel + Confirm buttons.
- **State B** (`2:43017`): Another variant of the multi-delete confirmation (possibly with different data state). Title: "ลบข้อมูล".
- **State C** (`2:43158`): Reconfirmation step. Title: "Reconfirm ลบข้อมูล". Cancel + Confirm buttons.

---

### POPUP TYPE 10: Delete Multiple Data - Success Alert

Small alert dialog (560px wide) confirming successful deletion of multiple items.

| State | Frame Name                                                   | Node ID    | Modal Type   | Title Text |
|-------|--------------------------------------------------------------|------------|--------------|------------|
| A     | Reconciliation Transaction / Popup / Delete Multiple - 9     | `2:43299`  | Modal Alert  | สำเร็จ     |

- Icon: Green checkmark (success).
- Message: "ลบข้อมูลสำเร็จ" (Delete data successful).
- Single OK/Close button.

---

### POPUP TYPE 11: Delete Multiple Data - Print Cancel Reconcile Report

Full-screen modal dialog (1346px wide) showing a printable report after multiple deletion.

| State | Frame Name                                                   | Node ID    | Modal Type    | Title Text                       |
|-------|--------------------------------------------------------------|------------|---------------|----------------------------------|
| A     | Reconciliation Transaction / Popup / Delete Multiple - 10    | `2:43308`  | Modal Dialog  | Print Cancel Reconcile Report    |

- Sub-header: "Branch Summary Report"
- Contains: report image/preview area with financial data table.
- Buttons: Cancel/Close + Print/Export.

---

### POPUP TYPE 12: Warning / Alert Dialog (Error Case - Can't Reconcile)

Small alert dialog (560px wide) for Quality/Output mismatch warning. Located in the flow overview section (node `2:39725`), not within the Popup section itself.

| State | Frame Name   | Node ID    | Modal Type   | Title Text        | Parent Section      |
|-------|-------------|------------|--------------|-------------------|---------------------|
| A     | Modal Alert | `2:40592`  | Modal Alert  | การแจ้งเตือน (Warning) | `2:39725` (Error Case - Can't Reconcile) |

- Icon: Red exclamation mark circle (warning/error).
- Message (Thai): "มีข้อผิดพลาดในข้อมูล Quality และ Output ของ Header Card 0054941201: มี Output ที่ระบบไม่รู้จัก [SHREDDED] หากมีข้อผิดพลาดจริงให้ลบข้อมูล Header Card นี้ ออกจากระบบ แล้ว Manual Key-in เข้าระบบแทน"
- Single OK/Confirm button.

---

## Flow Annotations (Non-Popup Elements)

The following text labels and arrows exist within the Popup section (`2:41247`) to describe the user flow between popup states:

| Element          | Node ID    | Description                                                    |
|------------------|------------|----------------------------------------------------------------|
| OTP Supervisor   | `2:43348`  | Label indicating OTP verification by Supervisor role           |
| OTP Manager      | `2:43349`  | Label indicating OTP verification by Manager role              |
| Confirm Success  | `2:43350`  | Label indicating Supervisor path success                       |
| Confirm Success  | `2:43351`  | Label indicating Manager path success                          |
| Arrow 14         | `2:43353`  | Flow arrow connecting popup states                             |
| Arrow 16         | `2:43354`  | Flow arrow connecting popup states                             |
| Arrow 18         | `2:43355`  | Flow arrow connecting popup states                             |
| Arrow 21         | `2:41299`  | Flow arrow (Edit HeaderCard flow)                              |
| Arrow 22         | `2:43357`  | Flow arrow connecting popup states                             |
| Arrow 23         | `2:43360`  | Flow arrow connecting popup states                             |
| Arrow 24         | `2:43361`  | Flow arrow connecting popup states                             |
| Arrow 26         | `2:43363`  | Flow arrow connecting popup states                             |
| Arrow 28         | `2:41679`  | Flow arrow (Edit flow)                                         |
| Arrow 30         | `41:17292` | Flow arrow (Edit flow)                                         |
| Arrow 31         | `41:18016` | Flow arrow connecting popup states                             |
| Arrow 32         | `41:18122` | Flow arrow connecting popup states                             |
| Arrow 35         | `41:21243` | Flow arrow connecting popup states                             |
| Arrow 36         | `41:21244` | Flow arrow connecting popup states                             |

---

## OTP Approval Flow

The popup design indicates a **two-level approval process**:

1. **User** performs an action (Edit or Delete).
2. **OTP Supervisor** verification is required first.
3. If approved, **OTP Manager** verification follows.
4. Upon both approvals, a **Confirm Success** dialog is shown.

This applies to both Edit and Delete flows, with the Edit flow having separate paths for single-item and multi-item operations.

---

## Modal Template Types Used

| Template Name                  | Usage Count | Typical Size   | Description                                    |
|-------------------------------|-------------|----------------|------------------------------------------------|
| Modal Alert                   | 6 nodes     | 560 x 360px    | Success/Warning alert with icon + message + OK |
| Modal Dialog (small)          | 2 nodes     | 560-600 x 303-383px | Form dialog for data entry                |
| Template - Modal Dialog - OTP | 11 nodes    | 1280-1334px wide | Large review/confirm dialog with data tables  |
| Modal Dialog (full-width)     | 2 nodes     | 1346 x 900px   | Print report preview dialog                    |
