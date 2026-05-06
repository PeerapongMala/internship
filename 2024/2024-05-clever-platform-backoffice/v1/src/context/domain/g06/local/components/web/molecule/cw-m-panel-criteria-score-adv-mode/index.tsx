import CWInput from '@component/web/cw-input';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import useModal from '@global/utils/useModal';
import { ChangeEvent, useMemo, useState } from 'react';

type PanelScoreAdvModeProps = {
  disabled?: boolean;
  score?: number;
  replacedScore: number;
  gameScore?: number;
  checked?: boolean;
  maxScore?: number;
  onCheckedChange?: (checked: boolean) => void;
  onScoreChange?: (score: number, isReplaced: boolean) => void;
};

const PanelCriteriaScoreAdvMode = ({
  score,
  replacedScore,
  checked,
  gameScore,
  maxScore,
  onCheckedChange,
  onScoreChange,
  disabled,
}: PanelScoreAdvModeProps) => {
  const [pendingChecked, setPendingChecked] = useState(false);
  const modal = useModal();

  const maxScoreText = useMemo(() => {
    return maxScore ? `/${maxScore}` : null;
  }, [maxScore]);

  const handleCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numGameScore = Number(gameScore);
    if (!e.target.checked) {
      onCheckedChange?.(e.target.checked);

      if (!isNaN(numGameScore)) onScoreChange?.(numGameScore, false);
      return;
    }

    e.stopPropagation();
    modal.open();
    setPendingChecked(e.target.checked);
  };

  const handleScoreChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;

    if (maxScore && value > maxScore) {
      onScoreChange?.(maxScore, true);
      return;
    }
    onScoreChange?.(value, true);
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-md border-4 border-neutral-200 px-5 py-4',
        checked ? 'bg-orange-300' : 'bg-neutral-100',
      )}
    >
      <div className="flex justify-between">
        {/* checkbox กรอกคะแนนทับ */}
        <div className="flex items-center">
          <CWInputCheckbox
            min={0}
            max={maxScore}
            disabled={disabled}
            checked={checked}
            onChange={handleCheckBoxChange}
          />
          <span className="text-lg font-bold">กรอกคะแนนทับ</span>
        </div>

        {/* กรอกคะแนน */}
        <div className="flex items-center gap-4">
          <CWInput
            className="w-[150px]"
            inputClassName="text-right hide-arrow"
            placeholder="0"
            min={0}
            max={maxScore}
            type="number"
            disabled={disabled || !checked}
            value={score}
            onChange={handleScoreChange}
          />
          <span className="text-base font-bold">{maxScoreText}</span>
        </div>
      </div>

      <div className="flex justify-between">
        <span className={cn('text-sm', checked ? 'text-black' : 'text-red-500')}>
          *เลือกหากต้องการกรอกคะแนนเอง โดยไม่ใช่ระบบคำนวณคะแนน
        </span>

        <div className="text-primary">
          <span className="text-sm">คะแนนเดิม: </span>
          <span className="text-base font-bold">
            {gameScore}/{maxScore}
          </span>
        </div>
      </div>

      <CWModalCustom
        title="ยืนยันกรอกคะแนนด้วยตนเอง"
        open={modal.isOpen}
        buttonName="ยืนยัน"
        cancelButtonName="ยกเลิก"
        onOk={() => {
          onCheckedChange?.(pendingChecked);
          onScoreChange?.(replacedScore, true);
          modal.close();
        }}
        onClose={() => {
          modal.close();
        }}
      >
        คุณยืนยันที่จะใช้คะแนนจากการกรอกแทนการคำนวณอัตโนมัติใช่หรือไม่
      </CWModalCustom>
    </div>
  );
};

export default PanelCriteriaScoreAdvMode;
