import React from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import ScreenTemplate from '../local/component/web/template/cw-t-line-layout';
import CWButton from '@component/web/cw-button';
import CWInput from '@component/web/cw-input';

const DomainJsx = () => {
  const { history } = useRouter();
  const navigate = useNavigate();

  const handleBack = () => {
    history.go?.(-1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    // alert('line family');
    navigate({ to: '/line/parent/clever/dashboard/choose-student' });
  };

  return (
    <ScreenTemplate
      className="items-center justify-center"
      headerTitle="Clever Login"
      footer={false}
    >
      <p className="text-lg/7 font-bold">ผู้ปกครอง</p>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 p-5">
        <CWInput label="ชื่อ:" name="name" required />
        <CWInput label="เบอร์โทร:" name="phone" required />

        <div className="flex w-full flex-row gap-3">
          <CWButton
            className="flex-1"
            title="กลับ"
            variant="white"
            type="button"
            onClick={handleBack}
          />
          <CWButton className="flex-1" title="connect" variant="primary" type="submit" />
        </div>
      </form>
    </ScreenTemplate>
  );
};

export default DomainJsx;
