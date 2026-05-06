import { useState } from 'react';
import CWInput from '@component/web/cw-input'; // นำเข้า CWInput
import { StageCardProps, StageValues } from '@domain/g04/g04-d04/local/type';

export const CWStageCard = ({
  title,
  star_required,
  gold_coin,
  arcade_coin,
}: StageCardProps) => {
  return (
    <div className="w-[500px]">
      <div className="bg-neutral-100 px-5 py-3">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="mt-5 flex flex-col gap-5">
        <CWInput
          label="จำนวน (เหรียญทอง):"
          value={gold_coin ?? 0}
          required
          disabled={true}
        />
        <CWInput
          label="จำนวน (เหรียญ Arcade):"
          placeholder="0"
          value={arcade_coin ?? 0}
          required
          disabled={true}
        />
      </div>
    </div>
  );
};
