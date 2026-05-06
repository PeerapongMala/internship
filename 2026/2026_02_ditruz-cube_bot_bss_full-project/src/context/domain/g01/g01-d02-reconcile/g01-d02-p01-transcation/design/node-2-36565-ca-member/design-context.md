# Design Context: CA Member - Reconciliation Transaction

**Figma Node ID:** `2:36565`
**Node Name:** Reconciliation Transaction - Unsort CC Member
**Dimensions:** 1440 x 900
**Type:** WEB_PAGE_OR_APP_SCREEN

> Note: The full node and its sub-frames were too large for Figma to generate rendered code.
> The structural metadata below contains complete layout hierarchy with positions, sizes, and text values.

## Page Structure Overview

This variant is for CA (Currency Authentication) Member transactions. The layout is structurally
identical to the Unsort CC variant (2:36001) with the same filter dropdowns and table structure.
The difference is in the data context (member vs non-member banknote processing).

### Layout matches Unsort CC (2:36001):
- Same filter dropdowns section (Frame 6114) with denomination and shift selects
- Same table layouts starting at y=298
- Same right panel with card info (123px height) and machine data table (635px height)
- Same title: "Reconciliation Transaction UNFIT" / "กระทบยอดธนบัตรประเภท UNFIT"

### Key Sections:
1. **Navigation Header** (instance, 1440x40)
2. **Title Area** (Frame 6126, 1403x62)
3. **Scanner Section** (Frame 6115, 1071x205) - Scanner + status + filter dropdowns
4. **Right Panel** (Frame 6117, 316x774) - Card info + machine data
5. **Preparation Table** (445x553)
6. **Preparation + Machine Table** (607x553)

## Scanner & Filter Section

```xml
<frame id="32:30554" name="Frame 6115" x="0" y="0" width="1071" height="205">
  <text name="สแกน Header Card เพื่อกระทบยอดธนบัตรประเภท UNFIT" />
  <!-- Scanner input field -->
  <frame name="Frame" width="390.5" height="67">
    <text name="Label" />  <!-- Header Card label -->
    <frame name="Frame 6143"><!-- Input --></frame>
  </frame>
  <!-- Status display -->
  <frame name="Frame 6144" width="390.5" height="67">
    <text name="กระทบยอดแล้วทั้งหมด" />
    <text name="100" />
    <text name="มัด" />
    <text name="กรุงเทพฯ M7-1 ศกท." />
    <text name="ผลัดบ่าย" />
  </frame>
  <!-- Buttons -->
  <frame name="Frame 6157" width="226" height="67">
    <frame name="button" width="93" height="41" />
    <frame name="button" width="109" height="41" />
  </frame>
  <!-- Filter dropdowns -->
  <frame id="32:30585" name="Frame 6114" x="24" y="124" width="1023" height="65">
    <frame name="Frame 6150" width="425" height="57">
      <instance name="select" width="200" height="31" />  <!-- Denomination -->
      <instance name="select" width="150" height="31" />  <!-- Shift -->
    </frame>
    <frame name="button" width="110" height="31" />  <!-- Search -->
  </frame>
</frame>
```

## Tables

Same data tables as Unsort CC:
- **Preparation Table** at (11, 298), 445x553
- **Preparation + Machine Data Table** at (475, 298), 607x553
- **Right Panel Machine Table** at (1087, 139), 316x635

## Full Metadata XML

```xml
<frame id="2:36565" name="Reconciliation Transaction - Unsort CC Member" x="3432" y="632" width="1440" height="900">
  <frame id="2:36566" name="Background" x="0" y="0.7998046875" width="1440" height="900" />
  <instance id="2:36575" name="Navigation Header" x="0" y="0" width="1440" height="40" />
  <frame id="32:30530" name="Frame" x="0" y="40.19921875" width="1435" height="860">
    <!-- Title bar (32:30531) -->
    <!-- Main content area (32:30552) with scanner, filters, tables -->
  </frame>
</frame>
```
