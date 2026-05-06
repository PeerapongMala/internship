# Design Context: Main Layout - Reconciliation Transaction Unfit

**Figma Node ID:** `32:25438`
**Node Name:** Reconciliation Transaction - Unfit
**Dimensions:** 1440 x 900
**Type:** WEB_PAGE_OR_APP_SCREEN

> Note: The full node and its sub-frames were too large for Figma to generate rendered code.
> The structural metadata below contains complete layout hierarchy with positions, sizes, and text values.

## Page Structure Overview

This variant shows the "Unfit" reconciliation transaction layout without the CC filter dropdowns.
It has a simpler header area (no dropdown selects) compared to the Unsort CC variants.

### Key Sections:
1. **Navigation Header** (instance, 1440x40) - Top navigation bar
2. **Title Area** (Frame 6126) - Page title and action buttons
3. **Left Panel** (Frame 6116, 1071x774) - Scanner input, status info, and two data tables
4. **Right Panel** (Frame 6117, 316x774) - Header card info and machine data table
5. **Sub Menu Level 3** (230x117) - Dropdown menu overlay with Holding, Holding Detail, settings

## Section 1: Title Bar (sub-node 32:25448)

```xml
<frame id="32:25448" name="Frame 6126" x="16" y="8" width="1403" height="62">
  <!-- Title text -->
  <text name="Reconciliation Transaction UNFIT" width="1035" height="36" />
  <text name="กระทบยอดธนบัตรประเภท UNFIT" width="1035" height="24" />
  <!-- Action buttons row -->
  <frame name="Frame 6153" width="368" height="36">
    <frame name="button" width="115" height="36"><!-- icon + text --></frame>
    <frame name="button" width="85" height="36"><!-- text only --></frame>
    <frame name="button" width="136" height="36"><!-- text only --></frame>
  </frame>
</frame>
```

## Section 2: Left Panel - Scanner & Status (sub-node 32:25471)

```xml
<frame id="32:25471" name="Frame 6115" x="0" y="0" width="1071" height="132">
  <text name="สแกน Header Card เพื่อกระทบยอดธนบัตรประเภท UNFIT" />
  <!-- Scanner Input -->
  <frame name="Frame" width="390.5" height="67">
    <text name="Label" width="82" />  <!-- "Header Card" label -->
    <frame name="Frame 6143">  <!-- Input group with scan field -->
      <frame name="Group" width="390.5" height="41" />
    </frame>
  </frame>
  <!-- Status Display -->
  <frame name="Frame 6144" width="390.5" height="67">
    <text name="กระทบยอดแล้วทั้งหมด" />
    <text name="100" />
    <text name="มัด" />
    <text name="กรุงเทพฯ M7-1 ศกท." />
    <text name="ผลัดบ่าย" />
  </frame>
  <!-- Action buttons: สแกน, ค้นหา -->
  <frame name="Frame 6157" width="226" height="67">
    <frame name="button" width="93" height="41" />  <!-- icon + "สแกน" -->
    <frame name="button" width="109" height="41" />  <!-- icon + "ค้นหา" -->
  </frame>
</frame>
```

## Section 3: Right Panel - Card Info (sub-node 32:25502)

```xml
<frame id="32:25502" name="Frame 6117" width="316" height="774">
  <!-- Card Summary Info -->
  <frame name="Frame 6113" width="316" height="132">
    <frame><text name="Label" /> <!-- ชื่อ --> <text name="Label" /> <!-- value --></frame>
    <frame><text name="Label" /> <!-- สถานะ --> <text name="Label" /></frame>
    <frame><text name="Label" /> <!-- ประเภทธนบัตร --> <text name="Label" /></frame>
    <frame><text name="Label" /> <!-- วันที่ทำรายการ --> <text name="Label" /></frame>
    <frame><text name="Label" /> <!-- มัด --> <text name="Label" /></frame>
  </frame>
  <!-- Machine Data Table -->
  <frame name="Table" width="316" height="626">
    <text name="Header Card from Machine" />
    <!-- Table Headers: Header Card, วันเวลา นับคัด, ชนิดราคา, Action -->
    <!-- 5 visible data rows with header cards like 0054941220, timestamps, denomination badges, action buttons -->
  </frame>
</frame>
```

## Section 4: Preparation Table (sub-node 32:25672)

```xml
<frame id="32:25672" name="Table" x="11" y="224" width="445" height="627">
  <text name="Preparation" />
  <!-- Headers: Header Card, วันเวลาเตรียม, ชนิดราคา, Action -->
  <!-- 5 data rows: 0054941124-0054941128, dates 21/7/2568 14:00, denomination badges, edit/delete buttons -->
  <!-- Scrollbar indicator -->
</frame>
```

## Section 5: Preparation + Machine Data Table (sub-node 32:25767)

```xml
<frame id="32:25767" name="Table" x="475" y="224" width="607" height="627">
  <text name="Preparation + Data from Machine" />
  <!-- Headers: Header Card, วันเวลาเตรียม, วันเวลานับคัด, ชนิดราคา, Action -->
  <!-- 5 data rows: 0054941201-0054941206, dual date columns, denomination badges, action buttons -->
  <!-- Row 0054941205 has only 1 action button (vs 2 for others) -->
  <!-- Row 0054941206 has warning icon next to header card number -->
</frame>
```

## Section 6: Sub Menu Level 3 Overlay (sub-node 32:26417)

```xml
<frame id="32:26417" name="Sub Menu Level 3" x="383" y="-7" width="230" height="117">
  <frame name="Frame 6131"><text name="Holding" /></frame>
  <frame name="Frame 6132"><text name="Holding Detail" /></frame>
  <frame name="Frame 6133"><text name="ตั้งค่าการทำงานเริ่มต้น" /></frame>
</frame>
```

## Full Metadata XML

```xml
<frame id="32:25438" name="Reconciliation Transaction - Unfit" x="80" y="367.5" width="1440" height="900">
  <frame id="32:25439" name="Background" x="0" y="0" width="1440" height="900">
    <rounded-rectangle id="32:25440" name="Background" x="0" y="0" width="1440.4970703125" height="899.07568359375" />
    <frame id="32:25441" name="Forground Color" x="0" y="0" width="1440" height="450">
      <rounded-rectangle id="32:25442" name="Chrome" x="0" y="0" width="1440" height="450" />
      <rounded-rectangle id="32:25443" name="Gradient Forground" x="0" y="0" width="1440" height="450" />
    </frame>
  </frame>
  <instance id="32:25446" name="Navigation Header" x="0" y="0" width="1440" height="40" />
  <frame id="32:25447" name="Frame" x="2" y="39.5" width="1435" height="860">
    <!-- Contains all content sections described above -->
  </frame>
</frame>
```
