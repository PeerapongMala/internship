# Design Context — Raw Output (Node 2:25046)

**Figma Node:** `2:25046` — "บันทึกข้อมูลสำเร็จ"
**Date Extracted:** 2026-02-19
**Client:** html,css,javascript / dotnet,razor

---

## Generated Code (React + Tailwind — for reference only, convert to Razor)

```jsx
const imgWrapper = "http://localhost:3845/assets/e2fa57036822e1301a933f53a2a76a82d3cf874a.svg";

export default function Component() {
  return (
    <div className="bg-[rgba(12,12,12,0.38)] relative size-full" data-name="บันทึกข้อมูลสำเร็จ" data-node-id="2:25046">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-[#eee] border-solid content-stretch flex flex-col items-start left-1/2 max-h-[760px] max-w-[960px] min-h-[360px] min-w-[560px] overflow-clip rounded-[12px] top-[calc(50%-0.5px)]" data-name="Modal Alert" data-node-id="2:25047">
        <div className="bg-white content-stretch flex flex-col gap-[16px] items-center justify-center pb-[16px] pt-[32px] px-[16px] relative shrink-0 w-full" data-name="Top Bar" data-node-id="2:25048">
          <div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0" data-name="Error" data-node-id="2:25049">
            <div className="relative shrink-0 size-[48px]" data-name="wrapper" data-node-id="I2:25049;1:15680">
              <img alt="" className="block max-w-none size-full" src={imgWrapper} />
            </div>
          </div>
          <p className="font-['Pridi:Medium',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[24px] text-black tracking-[0.6px]" data-node-id="2:25050">
            สำเร็จ
          </p>
        </div>
        <div className="content-stretch flex flex-col h-[143px] items-center px-[32px] py-[24px] relative shrink-0 w-full" data-node-id="2:25051">
          <p className="font-['Pridi:Medium',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[20px] text-black tracking-[0.5px]" data-node-id="2:25052">
            แก้ไขข้อมูลสำเร็จ
          </p>
        </div>
        <div className="bg-white border-[var(--slate\/300,#cbd5e1)] border-solid border-t content-stretch flex items-center justify-center p-[var(--space\/s-md,16px)] relative shrink-0 w-full" data-node-id="2:25053">
          <div className="bg-[#198754] border border-[#198754] border-solid content-stretch flex gap-[8px] items-center justify-center min-w-[160px] overflow-clip px-[13px] py-[7px] relative rounded-[6px] shrink-0 w-[160px]" data-name="button" data-node-id="2:25054">
            <div className="bg-[rgba(255,255,255,0)] relative shrink-0" data-name="text" data-node-id="I2:25054;288:222124">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[inherit]">
                <p className="font-['Pridi:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[16px] text-white tracking-[0.4px]" data-node-id="I2:25054;288:222124;1:4738">
                  ตกลง
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Style Definitions Found

```
Body Text/Body Color: #212529
Theme/Success: #198754
HitBox: #FFFFFF
Heading/H4: Font(family: "Pridi", style: Medium, size: 24, weight: 500, lineHeight: 1.2, letterSpacing: 2.5)
Heading/H5: Font(family: "Pridi", style: Medium, size: 20, weight: 500, lineHeight: 1.2, letterSpacing: 2.5)
Gray/White: #FFFFFF
Body/Regular: Font(family: "Pridi", style: Regular, size: 16, weight: 400, lineHeight: 1.5, letterSpacing: 2.5)
```

---

## Component Descriptions

### icon-wrapper (Node 1:22)
Icon with multi-size

### button (Node 1:385)
Button with styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.
- Documentation: https://getbootstrap.com/docs/5.3/components/buttons/

### text/text (Node 1:226)
Text Bullet List

---

## Node ID Map

| Node ID | Name | Role |
|---------|------|------|
| 2:25046 | บันทึกข้อมูลสำเร็จ | Root overlay |
| 2:25047 | Modal Alert | Modal container |
| 2:25048 | Top Bar | Icon + title section |
| 2:25049 | Error (misnamed) | Icon wrapper |
| 2:25050 | (title text) | "สำเร็จ" |
| 2:25051 | (content section) | Message area |
| 2:25052 | (message text) | "แก้ไขข้อมูลสำเร็จ" |
| 2:25053 | (footer) | Button bar |
| 2:25054 | button | OK button |

---

## Image Assets

| Asset | URL |
|-------|-----|
| Success checkmark icon (SVG) | `http://localhost:3845/assets/e2fa57036822e1301a933f53a2a76a82d3cf874a.svg` |

---

## Implementation Notes

- Convert from React + Tailwind to **Razor + plain CSS** (project stack: dotnet, razor)
- Use `font-family: 'bss-pridi'` (NOT `'Pridi'`) per project conventions
- Button matches Bootstrap `.btn-success` pattern — consider using Bootstrap class instead of custom CSS
- The icon wrapper node is named "Error" in Figma but is actually used for the success state (green checkmark)
