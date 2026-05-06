# Design Context: Unsort CC - Reconciliation Transaction

**Figma Node ID:** `2:36001`
**Node Name:** Reconciliation Transaction - Unsort CC
**Dimensions:** 1440 x 900
**Type:** WEB_PAGE_OR_APP_SCREEN

> Note: The full node and its sub-frames were too large for Figma to generate rendered code.
> The structural metadata below contains complete layout hierarchy with positions, sizes, and text values.

## Page Structure Overview

This variant adds CC (Currency Classification) filtering with dropdown selects compared to the main Unfit layout.
The header area includes denomination and shift filter dropdowns plus a search button.

### Key Differences from Main Layout (32:25438):
- Has **Frame 6114** section with dropdown selects for filtering (denomination + shift)
- Has a "ค้นหา" (Search) button next to the dropdowns
- Tables start at y=298 instead of y=224 (shifted down to accommodate filter row)
- No Sub Menu Level 3 overlay

### Key Sections:
1. **Navigation Header** (instance, 1440x40)
2. **Title Area** (Frame 6126, 1403x62) - Same title and action buttons
3. **Scanner Section** (Frame 6115, 1071x205) - Scanner input + status + filter dropdowns
4. **Right Panel** (Frame 6117, 316x774) - Card info + machine data table
5. **Preparation Table** (445x553) - Left table
6. **Preparation + Machine Table** (607x553) - Center-right table

## Section: Filter Dropdowns (unique to Unsort CC variants)

```xml
<frame id="32:29009" name="Frame 6114" x="24" y="124" width="1023" height="65">
  <frame name="Frame 6150" x="464" y="8" width="425" height="57">
    <!-- Denomination Select -->
    <frame name="Frame 6145" width="200" height="57">
      <text name="Label" width="82" />  <!-- ชนิดราคา label -->
      <instance name="select" width="200" height="31" />
    </frame>
    <!-- Shift Select -->
    <frame name="Frame 6149" width="200" height="57">
      <text name="Label" width="54" />  <!-- ผลัด label -->
      <instance name="select" width="150" height="31" />
    </frame>
  </frame>
  <!-- Search Button -->
  <frame name="Frame 6152" x="913" y="8" width="110" height="57">
    <frame name="button" width="110" height="31">
      <instance name="text" width="76" height="21" />  <!-- ค้นหา -->
    </frame>
  </frame>
</frame>
```

## Section: Right Panel Card Info

```xml
<frame id="32:29028" name="Frame 6117" width="316" height="774">
  <frame name="Frame 6113" width="316" height="123">
    <!-- 5 label-value rows same as main layout -->
  </frame>
  <frame name="Table" width="316" height="635">
    <text name="Header Card from Machine" />
    <!-- Headers: Header Card, วันเวลา นับคัด, ชนิดราคา, Action -->
    <!-- 5 visible data rows -->
  </frame>
</frame>
```

## Section: Preparation Table

```xml
<frame id="32:29198" name="Table" x="11" y="298" width="445" height="553">
  <text name="Preparation" />
  <!-- Headers: Header Card, วันเวลาเตรียม, ชนิดราคา, Action -->
  <!-- 5 data rows: 0054941124-0054941128 -->
</frame>
```

## Section: Preparation + Machine Data Table

```xml
<frame id="32:29291" name="Table" x="475" y="298" width="607" height="553">
  <text name="Preparation + Data from Machine" />
  <!-- Headers: Header Card, วันเวลาเตรียม, วันเวลานับคัด, ชนิดราคา, Action -->
  <!-- 5 data rows: 0054941201-0054941206 -->
</frame>
```

## Full Metadata XML

```xml
<frame id="2:36001" name="Reconciliation Transaction - Unsort CC" x="1723" y="632" width="1440" height="900">
  <frame id="2:36002" name="Background" x="0" y="0.4000244140625" width="1440" height="900" />
  <instance id="2:36011" name="Navigation Header" x="0" y="0" width="1440" height="40" />
  <frame id="32:28954" name="Frame" x="0" y="39.599609375" width="1435" height="860">
    <!-- Title bar (32:28955) -->
    <!-- Main content area (32:28976) with scanner, filters, tables -->
  </frame>
</frame>
```
