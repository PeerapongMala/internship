# Design Context: Verify Confirmation

**Figma Node:** `1:9829`
**Date:** 2026-02-19
**Note:** Figma MCP not available. Structure inferred from user screenshot and implemented code. When MCP becomes available, fetch `get_design_context` on node `1:9829` to get exact values.

---

## Inferred Figma Structure

```xml
<frame id="1:9829" name="Verify Confirmation" width="~1440" height="~900">

  <!-- ============================================ -->
  <!-- BACKGROUND -->
  <!-- ============================================ -->
  <frame name="Background">
    <!-- Gradient varies by BnType variant -->
    <!-- UF: blue, UC: orange, CA: green, CN: purple -->
  </frame>

  <!-- ============================================ -->
  <!-- NAVIGATION HEADER (shared with p01) -->
  <!-- ============================================ -->
  <frame name="Navigation Header" width="1440" height="40">
    <!-- Reuses _Layout.cshtml shared navigation -->
    <!-- BOT logo + system name + menu + user profile -->
  </frame>

  <!-- ============================================ -->
  <!-- MAIN CONTENT (centered, max-width ~660px) -->
  <!-- ============================================ -->
  <frame name="Content Wrapper" maxWidth="660">

    <!-- TITLE BAR -->
    <frame name="Title Bar">
      <text name="Page Title">Verify {BnTypeName}</text>
      <frame name="Print Data Button">
        <instance name="Printer Icon" />
        <text name="Print Data" />
      </frame>
    </frame>

    <!-- INFO CARD -->
    <frame name="Info Card" borderRadius="12">
      <frame name="Date Row" background="#f8d7da">
        <text name="Date Label">Date:</text>
        <text name="Date Value">21/7/2568 16:26</text>
        <instance name="Alert Icon" />  <!-- Red circle -->
      </frame>
      <frame name="Supervisor Row">
        <text name="Supervisor Label">Supervisor:</text>
        <text name="Supervisor Value">โพศาล เสาวลักษณ์</text>
      </frame>
      <frame name="Machine Row">
        <text name="Machine Label">Sorting Machine:</text>
        <text name="Machine Value">กรุงเทพฯ M7-1 ศกท.</text>
      </frame>
    </frame>

    <!-- DETAIL TABLE -->
    <frame name="Detail Card" borderRadius="12">
      <text name="Title">รายละเอียดธนบัตร</text>

      <frame name="Table Header" background="#f8fafc">
        <text>ชนิดราคา</text>
        <text>ประเภท</text>
        <text>แบบ</text>
        <text>จำนวนฉบับ</text>
        <text>จำนวนขาด(ฉบับ)</text>
        <text>จำนวนเกิน(ฉบับ)</text>
      </frame>

      <!-- Data rows -->
      <frame name="Row 1">
        <instance name="Badge 1000" />
        <text>ดี</text><text>17</text><text>2,986</text><text>-</text><text>-</text>
      </frame>
      <frame name="Row 2">
        <instance name="Badge 1000" />
        <text>ทำลาย</text><text>17</text><text>3</text><text>-</text><text>-</text>
      </frame>
      <frame name="Row 3">
        <instance name="Badge 1000" />
        <text>Reject</text><text>16</text><text>11</text><text>-</text><text>-</text>
      </frame>
      <frame name="Row 4">
        <instance name="Badge 1000" />
        <text>ปลอม</text><text></text><text>1</text><text>-</text><text>-</text>
      </frame>
      <!-- Empty placeholder rows -->
    </frame>

    <!-- SUMMARY CARD -->
    <frame name="Summary Card" borderRadius="12">
      <frame name="Row Good"><text>(+) รวมธนบัตร ดี/เสีย/ทำลาย ทั้งสิ้น</text><text>2,988</text><text>ฉบับ</text></frame>
      <frame name="Row Reject"><text>(+) รวมธนบัตร Reject จำนวนทั้งสิ้น</text><text color="#dc3545">11</text><text>ฉบับ</text></frame>
      <frame name="Row Shortage"><text>(+) รวมธนขาด จำนวนทั้งสิ้น</text><text color="#dc3545">-</text><text>ฉบับ</text></frame>
      <frame name="Row Excess"><text>(-) รวมธนบัตรเกิน จำนวนทั้งสิ้น</text><text color="#dc3545">-</text><text>ฉบับ</text></frame>
      <frame name="Row Damaged"><text>(O) ธนบัตรชำรุด จำนวนทั้งสิ้น</text><text>-</text><text>ฉบับ</text></frame>
      <frame name="Row Counterfeit"><text>(O) ธนบัตรปลอม จำนวนทั้งสิ้น</text><text>1</text><text>ฉบับ</text></frame>
      <frame name="Row Total" borderTop="2px solid #212121"><text>รวมทั้งสิ้น</text><text>3,000</text><text>ฉบับ</text></frame>
    </frame>

    <!-- FOOTER BUTTONS -->
    <frame name="Footer" gap="16">
      <frame name="Back Button" background="#6c757d" borderRadius="8">
        <text>กลับไปหน้า Auto Selling</text>
      </frame>
      <frame name="Verify Button" background="#003366" borderRadius="8">
        <text>Verify</text>
      </frame>
    </frame>

  </frame>
</frame>
```

---

## Key Differences from p01 Auto Selling (node 2:17435)

| Aspect | p01 Auto Selling | p02 Verify Confirmation |
|--------|-----------------|------------------------|
| Layout | Full-width 6-panel (2x3) | Centered single-column (~660px) |
| Complexity | 5 filter dropdowns, 6 tables, multiple popups | 1 info card, 1 table, 1 summary |
| Purpose | Data management (CRUD) | Review/confirm before verify |
| Footer | 3 action buttons | 2 buttons (back + verify) |
| Filter bar | Yes (5 dropdowns) | No |
| Checkbox | Yes (row selection) | No |
| Action buttons | Edit/Delete per row | None |
