# Design Context: Auto Selling - Unsort CC - Default State

**Figma Node:** `2:20263`
**Date Fetched:** 2026-02-19
**Note:** The design was too large for a single `get_design_context` call. The API returned sparse metadata (XML structure with positions/sizes). Sub-layer detail calls may be needed for specific sections.

---

## Raw Figma Structure (XML)

```xml
<frame id="2:20263" name="Auto Selling - Unsort CC -  Default" x="100" y="426" width="1440" height="900">

  <!-- ============================================ -->
  <!-- BACKGROUND (2:20264) -->
  <!-- ============================================ -->
  <frame id="2:20264" name="Background" x="0" y="0" width="1440" height="900">
    <rounded-rectangle id="2:20265" name="Background" x="0" y="0" width="1440.497" height="899.076" />
    <frame id="2:20266" name="Forground Color" x="0" y="0" width="1440" height="450">
      <rounded-rectangle id="2:20267" name="Chrome" x="0" y="0" width="1440" height="450" />
      <rounded-rectangle id="2:20268" name="Gradient Forground" x="0" y="0" width="1440" height="450" />
      <rounded-rectangle id="2:20269" name="image 1" x="-450.043" y="-439.940" width="901.086" height="880.940" />
      <rounded-rectangle id="2:20270" name="image 1" x="949.25" y="-476.290" width="980.500" height="958.579" />
    </frame>
  </frame>

  <!-- ============================================ -->
  <!-- NAVIGATION HEADER (2:20271) -->
  <!-- ============================================ -->
  <frame id="2:20271" name="Navigation Header Prepare" x="0" y="0" width="1440" height="40">
    <instance id="2:20272" name="Background" x="0" y="0" width="1440" height="40" />
    <frame id="2:20273" name="Frame" x="12" y="3" width="1416" height="34">
      <frame id="2:20274" name="Frame" x="0" y="0" width="1308" height="34">
        <!-- Logo + System Name -->
        <frame id="2:20275" name="Frame" x="0" y="0" width="306" height="34">
          <frame id="2:20276" name="logo-bss 1" x="0" y="2" width="30" height="30" />
          <frame id="2:20459" name="Group-copy" x="39.305" y="1.210" width="124.155" height="12.437" />
          <frame id="2:20480" name="Frame" x="39.383" y="13.856" width="238" height="20">
            <text id="2:20481" name="ระบบตรวจสอบการนับคัดธนบัตร" x="0" y="0" width="173" height="20" />
            <text id="2:20482" name="Version 1.0.0" x="177" y="2" width="61" height="16" />
          </frame>
        </frame>
        <!-- Navigation Menu -->
        <instance id="2:20483" name="List Menu Nav" x="306" y="4.5" width="1002" height="25" />
      </frame>
      <!-- Profile -->
      <frame id="2:20484" name="Frame 6199" x="1308" y="0" width="108" height="34">
        <frame id="2:20485" name="Profile" x="0" y="0" width="108" height="34">
          <frame id="2:20486" name="Frame" x="0" y="2.5" width="66" height="29">
            <text id="2:20487" name="สมสวัสดิ์ มาดี" x="0" y="0" width="66" height="18" />
            <text id="2:20488" name="Operator" x="20" y="12" width="46" height="17" />
          </frame>
          <frame id="2:20489" name="Button" x="70" y="0" width="38" height="34">
            <frame id="2:20490" name="User Profile Naigation" x="4" y="2" width="30" height="30">
              <frame id="2:20491" name="Avatar" x="0" y="0" width="30" height="30" />
            </frame>
          </frame>
        </frame>
      </frame>
    </frame>
  </frame>

  <!-- ============================================ -->
  <!-- MAIN CONTENT AREA (2:20494) -->
  <!-- ============================================ -->
  <frame id="2:20494" name="Frame" x="0" y="40" width="1440" height="860">

    <!-- TITLE BAR (2:20495) -->
    <frame id="2:20495" name="Frame" x="18.5" y="0" width="1403" height="62">
      <!-- Page Title -->
      <frame id="2:20496" name="Frame" x="0" y="13" width="547" height="36">
        <text id="2:20498" name="Auto Selling UNSORT CC" x="0" y="0" width="547" height="36" />
      </frame>
      <!-- Info Panel -->
      <frame id="2:20500" name="Frame" x="577" y="5" width="414" height="52">
        <frame id="2:20501" name="Frame" x="8" y="8" width="245" height="36">
          <!-- Date + Sorting Machine -->
          <text id="2:20504" name="Label" x="4" y="0" width="28" height="18" /> <!-- "Date:" -->
          <text id="2:20506" name="Label" x="0" y="0" width="91" height="18" /> <!-- date value -->
          <instance id="2:20507" name="icon-wrapper" x="95" y="2" width="14" height="14" /> <!-- info icon -->
          <text id="2:20509" name="Label" x="4" y="0" width="97" height="18" /> <!-- Sorting Machine -->
          <text id="2:20510" name="Label" x="109" y="0" width="105" height="18" /> <!-- machine value -->
        </frame>
        <frame id="2:20511" name="Frame" x="261" y="8" width="145" height="36">
          <!-- Supervisor + Shift -->
          <text id="2:20513" name="Label" x="4" y="0" width="64" height="18" /> <!-- "Supervisor:" -->
          <text id="2:20514" name="Label" x="76" y="0" width="66" height="18" /> <!-- supervisor value -->
          <text id="2:20516" name="Label" x="4" y="0" width="31" height="18" /> <!-- "Shift:" -->
          <text id="2:20518" name="Label" x="43" y="0" width="42" height="18" /> <!-- shift value -->
        </frame>
      </frame>
      <!-- Action Buttons -->
      <frame id="2:20519" name="Frame" x="1021" y="13" width="382" height="36">
        <!-- Filter button -->
        <frame id="2:20520" name="button" x="0" y="0" width="98" height="36">
          <instance id="2:20521" name="icon" x="16" y="10" width="16" height="16" />
          <text id="2:20523" name="text" x="0" y="0" width="42" height="24" /> <!-- "Filter" -->
        </frame>
        <!-- Open Screen 2 button -->
        <frame id="2:20525" name="button" x="114" y="0" width="125" height="36">
          <instance id="2:20526" name="icon" x="8" y="10" width="16" height="16" />
          <text id="2:20528" name="text" x="0" y="0" width="85" height="24" /> <!-- "เปิดหน้าจอ 2" -->
        </frame>
        <!-- Print Data button -->
        <frame id="2:20530" name="button" x="255" y="0" width="127" height="36">
          <instance id="2:20531" name="icon" x="12" y="10" width="16" height="16" />
          <text id="2:20533" name="text" x="0" y="0" width="79" height="24" /> <!-- "Print Data" -->
        </frame>
      </frame>
    </frame>

    <!-- FILTER BAR (2:20535) -->
    <frame id="2:20535" name="Frame" x="16" y="62" width="1408" height="734">
      <frame id="2:20536" name="Frame" x="0" y="0" width="1408" height="63">
        <frame id="2:20537" name="Frame" x="24" y="16" width="1360" height="31">
          <!-- Filter 1: Header Card -->
          <frame id="2:20538" name="Frame" x="0" y="0" width="248" height="31">
            <text id="2:20539" name="Label" x="0" y="4.5" width="85" height="22" />
            <instance id="2:20541" name="select" x="93" y="0" width="155" height="31" />
          </frame>
          <!-- Filter 2: ธนาคาร -->
          <frame id="2:20542" name="Frame" x="278" y="0" width="248" height="31">
            <text id="2:20543" name="Label" x="0" y="4.5" width="47" height="22" />
            <instance id="2:20544" name="select" x="55" y="0" width="193" height="31" />
          </frame>
          <!-- Filter 3: Zone -->
          <frame id="2:20545" name="Frame" x="556" y="0" width="248" height="31">
            <text id="2:20546" name="Label" x="0" y="4.5" width="33" height="22" />
            <instance id="2:20547" name="select" x="41" y="0" width="207" height="31" />
          </frame>
          <!-- Filter 4: Cashpoint -->
          <frame id="2:20548" name="Frame" x="834" y="0" width="248" height="31">
            <text id="2:20549" name="Label" x="0" y="4.5" width="70" height="22" />
            <instance id="2:20550" name="select" x="78" y="0" width="170" height="31" />
          </frame>
          <!-- Filter 5: ชนิดราคา -->
          <frame id="2:20551" name="Frame" x="1112" y="0" width="248" height="31">
            <text id="2:20552" name="Label" x="0" y="4.5" width="57" height="22" />
            <instance id="2:20553" name="select" x="65" y="0" width="183" height="31" />
          </frame>
        </frame>
      </frame>

      <!-- TABLES AREA (2:20557) -->
      <frame id="2:20557" name="Frame 6207" x="0" y="71" width="1408" height="663">

        <!-- LEFT PANEL (2:20558) - ~60% width -->
        <frame id="2:20558" name="Frame" x="0" y="0" width="844.8" height="663">

          <!-- TABLE 1: มัดครบจำนวน ครบมูลค่า (2:20559) -->
          <frame id="2:20559" name="Table" x="0" y="0" width="844.8" height="327.5">
            <!-- Section Header -->
            <frame id="2:20560" name="List Header" x="0" y="0" width="844.8" height="38">
              <text id="2:20562" name="มัดครบจำนวน ครบมูลค่า" />
              <text id="2:20565" name="จำนวน:" />
              <text id="2:20566" name="1,000" /> <!-- bold count -->
              <text id="2:20567" name="ฉบับ" />
            </frame>
            <!-- Column Headers (height: 30) -->
            <frame id="2:20576" name="List Header" x="0" y="38" width="844.8" height="30">
              <!-- Checkbox 20px | Header Card 133.7px | ชนิดราคา 80px | วันเวลานับคัด 116px | จำนวนฉบับ 133.7px | มูลค่า 133.7px | สถานะ 133.7px | Action 78px -->
            </frame>
            <!-- Data Row (height: 36) -->
            <frame id="2:20606" name="List" x="0" y="68" width="844.8" height="36">
              <text id="2:20612" name="0054941520" /> <!-- Header Card -->
              <text id="2:20616" name="Label" /> <!-- 1000 badge -->
              <text id="2:20618" name="21/07/2568 14:00" />
              <text id="2:20620" name="1,000" /> <!-- จำนวนฉบับ -->
              <text id="2:20622" name="1,000,000" /> <!-- มูลค่า -->
              <instance id="2:20624" name="Badge Status" /> <!-- Auto Selling -->
              <instance id="2:20626" name="button" /> <!-- edit 26x26 -->
              <instance id="2:20627" name="button" /> <!-- delete 26x26 -->
            </frame>
            <!-- Empty rows: 2:20628 through 2:20635 -->
          </frame>

          <!-- TABLE 2: มัดรวมครบจำนวน ครบมูลค่า (2:20642) -->
          <frame id="2:20642" name="Table" x="0" y="335.5" width="844.8" height="327.5">
            <frame id="2:20643" name="List Header" x="0" y="0" width="844.8" height="38">
              <text id="2:20645" name="มัดรวมครบจำนวน ครบมูลค่า" />
              <text id="2:20649" name="2,000" />
            </frame>
            <!-- Column Headers same structure -->
            <!-- Data rows: 2:20752 (1,995 / 1,995,000), 2:20774 (5 / 5,000) -->
          </frame>

          <!-- Hidden: Detail Table (2:20803) -->
        </frame>

        <!-- RIGHT PANEL (2:20971) - ~40% width -->
        <frame id="2:20971" name="Frame" x="852.8" y="0" width="555.2" height="663">
          <instance id="2:20972" name="Table - Auto Selling - A" x="0" y="0" width="555.2" height="215.667" />
          <instance id="2:20973" name="Table - Auto Selling - B" x="0" y="223.667" width="555.2" height="215.667" />
          <instance id="2:20974" name="Table - Auto Selling - C" x="0" y="447.333" width="555.2" height="215.667" />
          <!-- Hidden: Unsort CC form (2:20975) -->
        </frame>
      </frame>
    </frame>

    <!-- FOOTER BUTTONS (2:21014) -->
    <frame id="2:21014" name="Frame" x="16" y="796" width="1408" height="64">
      <instance id="2:21015" name="button" x="0" y="8" width="229" height="48" />     <!-- Refresh -->
      <frame id="2:21016" name="Frame" x="245" y="8" width="729" height="48" />         <!-- Spacer -->
      <instance id="2:21017" name="button" x="990" y="8" width="173" height="48" />    <!-- Manual Key-in -->
      <instance id="2:21018" name="button" x="1179" y="8" width="229" height="48" />   <!-- ดูรายการสรุปทั้งหมด -->
    </frame>
  </frame>
</frame>
```

---

## Key Node ID Reference

| Section | Node ID | Name |
|---------|---------|------|
| Root Frame | 2:20263 | Auto Selling - Unsort CC - Default |
| Background | 2:20264 | Background |
| Nav Header | 2:20271 | Navigation Header Prepare |
| Nav Menu | 2:20483 | List Menu Nav (instance) |
| Title Bar | 2:20495 | Title + Info + Actions |
| Page Title | 2:20498 | "Auto Selling UNSORT CC" |
| Info Panel | 2:20500 | Date/Machine/Supervisor/Shift |
| Filter Button | 2:20520 | Filter action button |
| Open Screen 2 | 2:20525 | Open screen 2 button |
| Print Data | 2:20530 | Print data button |
| Filter Bar | 2:20536 | 5 filter dropdowns |
| Content Area | 2:20557 | Two-panel tables area |
| Left Panel | 2:20558 | Tables 1 + 2 |
| Table 1 | 2:20559 | มัดครบจำนวน ครบมูลค่า |
| Table 2 | 2:20642 | มัดรวมครบจำนวน ครบมูลค่า |
| Right Panel | 2:20971 | Tables A + B + C |
| Table A | 2:20972 | Table - Auto Selling - A (มัดขาด-เกิน) |
| Table B | 2:20973 | Table - Auto Selling - B (มัดรวมขาด-เกิน) |
| Table C | 2:20974 | Table - Auto Selling - C (มัดเก็บโดยยอดจากเครื่องจักร) |
| Footer | 2:21014 | Footer buttons |
| Refresh Btn | 2:21015 | Refresh button |
| Manual Key-in | 2:21017 | Manual Key-in button |
| Summary Btn | 2:21018 | ดูรายการสรุปทั้งหมด button |
| Hidden Detail | 2:20803 | Detail table (hidden by default) |
| Hidden Unsort Form | 2:20975 | Unsort CC adjustment form (hidden) |
