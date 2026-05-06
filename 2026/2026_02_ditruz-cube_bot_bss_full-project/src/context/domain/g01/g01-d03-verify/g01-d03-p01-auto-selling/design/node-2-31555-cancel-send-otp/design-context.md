# Design Context - Cancel Send Popup OTP - 3

**Node ID:** 2:31555
**Date:** 2026-02-19
**Source:** Figma MCP `get_design_context` (raw output)

## Component Structure (React+Tailwind from Figma)

```jsx
const imgImage1 = "http://localhost:3845/assets/df40e539ba3b64f6b86cf092de6bc7980e96c99d.png";
const imgVector = "http://localhost:3845/assets/f5103b00ce4da6b2099045eb2ec2bd0d96d06dd1.svg";

type MoneyTypeProps = {
  className?: string;
  size?: "Default" | "Large";
  type?: "1000" | "500" | "100" | "50" | "20";
};

function MoneyType({ className, size = "Default", type = "1000" }: MoneyTypeProps) {
  const is1000AndLarge = type === "1000" && size === "Large";
  return (
    <div className={className || "bg-[#fbf8f4] border-2 border-[#9f7d57] border-solid h-[24px] relative w-[47px]"}>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[434.646px] left-[calc(50%+88.95px)] mix-blend-color-burn opacity-30 top-[calc(50%+46.85px)] w-[444.586px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <div className={`-translate-x-1/2 -translate-y-1/2 absolute flex flex-col justify-center leading-[0] not-italic text-[#4f3e2b] text-center whitespace-nowrap ${is1000AndLarge ? "font-['Pridi:SemiBold',sans-serif] left-[calc(50%+0.5px)] text-[16px] top-[10.5px] tracking-[0.4px]" : "font-['Pridi:Regular',sans-serif] left-1/2 text-[0px] top-[10px] tracking-[0.325px]"}`}>
        <p className={`leading-[normal] ${is1000AndLarge ? "" : "font-['Pridi:Bold',sans-serif] text-[13px]"}`}>1000</p>
      </div>
    </div>
  );
}

export default function CancelSendPopupOtp() {
  return (
    <div className="bg-white relative size-full" data-name="Cancel Send Popup OTP - 3" data-node-id="2:31555">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[rgba(12,12,12,0.38)] h-[900px] left-1/2 top-1/2 w-[1440px]" data-name="Template - Modal Dialog - OTP" data-node-id="2:31556">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-[#eee] border-solid content-stretch flex flex-col gap-[33px] h-[500px] items-start left-1/2 min-h-[360px] overflow-clip rounded-[12px] top-[calc(50%-20px)] w-[560px]" data-name="Modal Dialog" data-node-id="2:31557">

          {/* Top Bar */}
          <div className="bg-white border-[var(--slate/300,#cbd5e1)] border-b border-solid content-stretch flex h-[59px] items-center pb-[8px] pt-[16px] px-[16px] relative shrink-0 w-full" data-name="Top Bar" data-node-id="2:31558">
            <p className="font-['Pridi:Medium',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[24px] text-black tracking-[0.6px]" data-node-id="2:31559">
              Cancel Send
            </p>
          </div>

          {/* Content Area */}
          <div className="content-stretch flex flex-col gap-[16px] h-[306px] items-center p-[24px] relative shrink-0 w-full" data-name="Frame" data-node-id="2:31560">

            {/* Info Rows */}
            <div className="content-stretch flex flex-col gap-[8px] items-start p-[8px] relative shrink-0 w-full" data-node-id="2:31561">
              {/* Header Card */}
              <div className="content-stretch flex font-['Pridi:Regular',sans-serif] items-center justify-between leading-[1.5] not-italic relative shrink-0 text-[16px] text-black tracking-[0.4px] w-full" data-node-id="2:31562">
                <p className="relative shrink-0" data-node-id="2:31563">Header Card</p>
                <p className="relative shrink-0" data-node-id="2:31564">0054941525</p>
              </div>
              {/* Denomination */}
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="2:31565">
                <p className="font-['Pridi:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[16px] text-black tracking-[0.4px]" data-node-id="2:31566">ชนิดราคา</p>
                <MoneyType className="bg-[#fbf8f4] border-2 border-[#9f7d57] border-solid h-[24px] overflow-clip relative shrink-0 w-[47px]" size="Large" />
              </div>
              {/* Quantity */}
              <div className="content-stretch flex font-['Pridi:Regular',sans-serif] items-center justify-between leading-[1.5] not-italic relative shrink-0 text-[16px] text-black tracking-[0.4px] w-full" data-node-id="2:31568">
                <p className="relative shrink-0" data-node-id="2:31569">จำนวน (ฉบับ)</p>
                <p className="relative shrink-0" data-node-id="2:31570">997</p>
              </div>
            </div>

            {/* Confirmation Section */}
            <div className="content-stretch flex flex-col gap-[16px] items-start max-w-[540px] p-[8px] relative shrink-0 w-full" data-name="Frame" data-node-id="2:31571">
              <p className="font-['Pridi:Medium',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[24px] text-black tracking-[0.6px]" data-node-id="2:31572">
                ยืนยัน Cancel Send
              </p>
              {/* Manager Select */}
              <div className="content-stretch flex flex-col gap-[var(--space/s-xxxsm,4px)] items-start justify-center relative shrink-0 w-[291px]" data-name="Frame" data-node-id="2:31573">
                <div className="content-stretch flex flex-col gap-[8px] items-end justify-center relative shrink-0" data-name="Frame" data-node-id="2:31574">
                  <div className="flex flex-col font-['Pridi:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--color/neutral-text-primary,#212121)] text-right tracking-[0.35px] whitespace-nowrap" data-node-id="2:31575">
                    <p className="leading-[normal]">เลือก Manager</p>
                  </div>
                </div>
                <button className="bg-white border border-[#ced4da] border-solid content-stretch cursor-pointer flex flex-col items-center justify-center px-[13px] py-[7px] relative rounded-[6px] shrink-0 w-full" data-name="select" data-node-id="2:31577">
                  <div className="relative shrink-0 w-full" data-name="wrapper">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative w-full">
                      <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px overflow-clip relative" data-name="selection-item">
                        <div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0" data-name="placeholder">
                          <p className="font-['Pridi:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#6c757d] text-[16px] text-left tracking-[0.4px]">
                            วทัญญู งานดี
                          </p>
                        </div>
                      </div>
                      {/* Chevron down icon */}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-[var(--slate/300,#cbd5e1)] border-solid border-t content-stretch flex items-end justify-between p-[var(--space/s-md,16px)] relative shrink-0 w-full" data-name="Frame" data-node-id="2:31578">
            {/* Cancel Button */}
            <div className="bg-[var(--theme-colors/secondary,#6c757d)] border border-[var(--theme-colors/secondary,#6c757d)] border-solid content-stretch flex gap-[8px] items-center justify-center min-w-[160px] overflow-clip px-[13px] py-[7px] relative rounded-[6px] shrink-0 w-[160px]" data-name="button" data-node-id="2:31579">
              <p className="font-['Pridi:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[16px] text-white tracking-[0.4px]">
                ยกเลิก
              </p>
            </div>
            {/* Confirm Button */}
            <div className="bg-[#036] border border-[#036] border-solid content-stretch flex gap-[8px] items-center justify-center min-w-[160px] overflow-clip px-[13px] py-[7px] relative rounded-[6px] shrink-0" data-name="button" data-node-id="2:31580">
              <p className="font-['Pridi:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[16px] text-white tracking-[0.4px]">
                ส่งคำขออนุมัติแก้ไข
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
```

## Styles Referenced in Design

| Style Name | Definition |
|------------|------------|
| Heading/H4 | Font(family: "Pridi", style: Medium, size: 24, weight: 500, lineHeight: 1.2, letterSpacing: 2.5) |
| Body/Regular | Font(family: "Pridi", style: Regular, size: 16, weight: 400, lineHeight: 1.5, letterSpacing: 2.5) |
| Form Value 2 | Font(family: "Pridi", style: SemiBold, size: 16, weight: 600, lineHeight: 100, letterSpacing: 2.5) |
| Form Label 2 | Font(family: "Pridi", style: Regular, size: 14, weight: 400, lineHeight: 100, letterSpacing: 2.5) |
| Gray/600 | #6C757D |
| HitBox | #FFFFFF |
| Gray/800 | #343A40 |
| Theme/Body Background | #FFFFFF |
| Gray/400 | #CED4DA |
| Gray/White | #FFFFFF |
| Primary | #003366 |

## Component Descriptions (from Figma)

- **select** (1:5950): Select components for collecting user info from a list. Ref: Bootstrap 5.3 select.
- **button** (1:385): Button with styles for actions. Ref: Bootstrap 5.3 buttons.
- **text/text** (1:226): Text Bullet List
- **icon-wrapper** (1:22): Icon with multi-size

## Image Assets

| Asset | URL |
|-------|-----|
| Money pattern image | `http://localhost:3845/assets/df40e539ba3b64f6b86cf092de6bc7980e96c99d.png` |
| Chevron down SVG | `http://localhost:3845/assets/f5103b00ce4da6b2099045eb2ec2bd0d96d06dd1.svg` |
