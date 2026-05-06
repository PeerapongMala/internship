# Figma Node 2-49964 — Action Panel Design Specs

> Source: Figma MCP `get_screenshot` (2026-02-20)
> `get_design_context` returned fetch error — specs below combine screenshot analysis + task-provided values.

---

## Screenshot Reference

The panel shows:
- A textarea with label "หมายเหตุ:" (Note/Remark)
- Placeholder text: "นี่คือรายละเอียดที่พิมพ์เพื่อกดปุ่ม Denied"
- Green "Approve" button with checkmark icon
- Red "Deny" button with X icon
- Horizontal separator between buttons

---

## Layout

```css
/* Panel container */
.action-panel {
  width: 500px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #FFFFFF;
}
```

| Property        | Value   |
|-----------------|---------|
| Panel width     | 500px   |
| Padding         | 16px    |
| Component gap   | 12px    |
| Background      | #FFFFFF |

---

## Colors

| Element              | Hex       | CSS Variable / Usage                  |
|----------------------|-----------|---------------------------------------|
| Panel background     | #FFFFFF   | `background-color: #FFFFFF`           |
| Approve button bg    | #198754   | Bootstrap `btn-success` / `#198754`   |
| Approve button text  | #FFFFFF   | `color: #FFFFFF`                      |
| Deny button bg       | #DC3545   | Bootstrap `btn-danger` / `#DC3545`    |
| Deny button text     | #FFFFFF   | `color: #FFFFFF`                      |
| Textarea border      | #CED4DA   | Bootstrap default input border        |
| Separator color      | #DEE2E6   | `border-color: #DEE2E6`               |
| Label text           | #212529   | Bootstrap body text default           |

---

## Typography

### Label ("หมายเหตุ:")

```css
.action-panel label {
  font-family: 'Sarabun', sans-serif;  /* Thai-compatible font */
  font-size: 14px;
  font-weight: 400;
  color: #212529;
  letter-spacing: normal;
  margin-bottom: 4px;
}
```

### Textarea placeholder / input text

```css
.action-panel textarea {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #495057;
  letter-spacing: normal;
}
```

### Button text

```css
.action-panel .btn {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  font-weight: 700;  /* Bold as seen in screenshot */
  letter-spacing: normal;
}
```

---

## Notes / Textarea Section

```css
.action-panel .notes-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-panel textarea {
  width: 100%;           /* fills panel width */
  height: 80px;          /* approx from screenshot */
  border: 1px solid #CED4DA;
  border-radius: 4px;
  padding: 8px 12px;
  resize: vertical;
  font-size: 14px;
  color: #495057;
  background-color: #FFFFFF;
}
```

| Property       | Value              |
|----------------|--------------------|
| Label text     | หมายเหตุ:          |
| Textarea width | 100% (of 500px panel) |
| Textarea height | ~80px (auto/flexible) |
| Border         | 1px solid #CED4DA  |
| Border-radius  | 4px                |
| Padding        | 8px 12px           |
| Resize         | vertical           |

---

## Approve Button

```css
.btn-approve {
  width: 468px;
  height: 46px;
  background-color: #198754;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.btn-approve:hover {
  background-color: #157347;
}
```

| Property      | Value                              |
|---------------|------------------------------------|
| Width         | 468px                              |
| Height        | 46px                               |
| Background    | #198754 (Bootstrap success green)  |
| Text color    | #FFFFFF                            |
| Icon class    | `bi bi-check-circle`               |
| Button text   | อนุมัติ (Approve)                  |
| Border-radius | 4px                                |
| Font-weight   | 700 (Bold)                         |

HTML example:
```html
<button class="btn btn-approve">
  <i class="bi bi-check-circle"></i>
  อนุมัติ (Approve)
</button>
```

---

## Separator

```css
.action-panel .separator {
  width: 100%;
  height: 1px;
  background-color: #DEE2E6;
  margin: 4px 0;
  border: none;
}
```

| Property      | Value     |
|---------------|-----------|
| Height        | 1px       |
| Color         | #DEE2E6   |
| Margin top    | 4px       |
| Margin bottom | 4px       |

HTML example:
```html
<hr class="separator" />
```

---

## Deny Button

```css
.btn-deny {
  width: 468px;
  height: 48px;
  background-color: #DC3545;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.btn-deny:hover {
  background-color: #BB2D3B;
}
```

| Property      | Value                             |
|---------------|-----------------------------------|
| Width         | 468px                             |
| Height        | 48px                              |
| Background    | #DC3545 (Bootstrap danger red)    |
| Text color    | #FFFFFF                           |
| Icon class    | `bi bi-x-circle`                  |
| Button text   | ปฏิเสธ (Denied)                   |
| Border-radius | 4px                               |
| Font-weight   | 700 (Bold)                        |

HTML example:
```html
<button class="btn btn-deny">
  <i class="bi bi-x-circle"></i>
  ปฏิเสธ (Denied)
</button>
```

---

## Full Panel HTML Structure

```html
<div class="action-panel">

  <!-- Notes section -->
  <div class="notes-section">
    <label for="noteTextarea">หมายเหตุ:</label>
    <textarea
      id="noteTextarea"
      class="form-control"
      placeholder="นี่คือรายละเอียดที่พิมพ์เพื่อกดปุ่ม Denied"
      rows="3"
    ></textarea>
  </div>

  <!-- Approve button -->
  <button class="btn btn-approve">
    <i class="bi bi-check-circle"></i>
    อนุมัติ (Approve)
  </button>

  <!-- Separator -->
  <hr class="separator" />

  <!-- Deny button -->
  <button class="btn btn-deny">
    <i class="bi bi-x-circle"></i>
    ปฏิเสธ (Denied)
  </button>

</div>
```

---

## Full CSS Block (CSS-ready)

```css
/* Action Panel — Node 2-49964 */
.action-panel {
  width: 500px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #FFFFFF;
}

.action-panel label {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #212529;
  margin-bottom: 4px;
  display: block;
}

.action-panel textarea {
  width: 100%;
  height: 80px;
  border: 1px solid #CED4DA;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #495057;
  background-color: #FFFFFF;
  resize: vertical;
}

.action-panel textarea::placeholder {
  color: #6C757D;
}

.btn-approve {
  width: 468px;
  height: 46px;
  background-color: #198754;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.btn-approve:hover {
  background-color: #157347;
}

.action-panel .separator {
  width: 100%;
  height: 1px;
  background-color: #DEE2E6;
  margin: 4px 0;
  border: none;
}

.btn-deny {
  width: 468px;
  height: 48px;
  background-color: #DC3545;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.btn-deny:hover {
  background-color: #BB2D3B;
}
```

---

## Notes

- `get_design_context` returned a fetch error on 2026-02-20. Specs above use screenshot analysis + Bootstrap defaults + task-provided values.
- Font: Thai UI typically uses **Sarabun** or **Noto Sans Thai** — verify with project's global CSS.
- Icon library: **Bootstrap Icons** (`bi bi-check-circle`, `bi bi-x-circle`) — confirm CDN is loaded.
- Button text in screenshot shows "Approve" / "Deny" (English only). Task spec requires Thai+English: "อนุมัติ (Approve)" and "ปฏิเสธ (Denied)".
- Re-run `get_design_context` when rate limit resets for exact font/spacing tokens.
