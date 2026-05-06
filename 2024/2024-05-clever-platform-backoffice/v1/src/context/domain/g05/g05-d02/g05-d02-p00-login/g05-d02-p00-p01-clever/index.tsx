import CWInput from '@component/web/cw-input';

import React from 'react';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { useNavigate, useRouter } from '@tanstack/react-router';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';

const DomainJsx = () => {
  const { history } = useRouter();
  const navigate = useNavigate();

  const schoolID = '1'.padStart(13, '0');

  const handleBack = () => {
    history.go?.(-1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ to: '/line/parent/clever/family' });
  };

  return (
    <ScreenTemplate
      className="items-center justify-center"
      headerTitle="Clever Login"
      footer={false}
    >
      <p className="text-lg/7 font-bold">ยืนยันตัวตน</p>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 p-5">
        <CWInput
          value={schoolID}
          name="school-id"
          label="รหัสโรงเรียน:"
          disabled
          required
        />

        <CWInput
          type="tel"
          pattern="[0-9]*"
          inputMode="numeric"
          name="student-id"
          label="รหัสนักเรียน:"
          required
        />

        <div className="flex w-full flex-row gap-3">
          <CWButton
            className="flex-1"
            title="กลับ"
            variant="white"
            type="button"
            onClick={handleBack}
          />
          <CWButton
            icon={<IconPlus />}
            className="flex-1"
            title="เพิ่มโครงการ"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </ScreenTemplate>
  );
};

export default DomainJsx;
