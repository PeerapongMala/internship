// import { useState, useEffect } from 'react';
import { ModalCommon } from '../modal-common';

export function ModalRound({ round }: { round: number }) {
  const texts = {
    round: 'รอบที่',
  };

  return (
    <>
      <ModalCommon>
        <div className="text-center">
          <span className="font-kanit text-center text-[40px] font-bold text-white">
            {texts.round}
          </span>
          <br />
          <span className="font-sarpanch rotate-[0deg] text-center text-9xl font-extrabold text-white">
            {round}
          </span>
        </div>
      </ModalCommon>
    </>
  );
}
