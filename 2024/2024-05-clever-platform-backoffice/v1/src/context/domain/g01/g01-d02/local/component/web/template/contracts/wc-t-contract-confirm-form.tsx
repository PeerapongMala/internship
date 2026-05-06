import IconTask from '@core/design-system/library/component/icon/IconTask';
import API from '@domain/g01/g01-d02/local/api';
import { AffiliationContract, UseStatus } from '@domain/g01/g01-d02/local/type';
import showMessage from '@global/utils/showMessage';
import { useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

interface AffiliationContractConfirmFormProps {
  contractId?: string;
}

function AffiliationContractConfirmForm({
  contractId,
}: AffiliationContractConfirmFormProps) {
  const [contract, setContract] = useState<AffiliationContract>();
  const router = useRouter();
  if (!contractId) {
    console.log('no select');
  }

  useEffect(() => {
    if (contractId) {
      API.affiliationContract.GetById(contractId).then((res) => {
        if (res.status_code == 200) {
          setContract(res.data);
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }, []);

  function onSubmit() {
    if (contractId && contract) {
      API.affiliationContract
        .Update(+contractId, {
          ...contract,
          status: UseStatus.IN_USE,
          wizard_index: 4,
        })
        .then((res) => {
          console.log({ res: res });
          if (res.status_code == 201 || res.status_code == 200) {
            showMessage('เผยแพร่สำเร็จ', 'success');
            router.navigate({ to: '.', reloadDocument: true });
          } else {
            showMessage(res.message, 'error');
          }
        });
    }
  }
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 text-center">
      {/** affiliation contract confirm */}
      <span className="self-stretch border-b border-solid border-neutral-200 pb-5 text-3xl font-bold leading-8">
        ตรวจสอบความเรียบร้อย
      </span>
      <p className="text-lg">
        กรุณาตรวจสอบก่อนเผยแพร่ข้อมูล หลังจากที่เผยแพร่ข้อมูลแล้ว
        <br />
        คุณจะ<span className="underline">ไม่สามารถแก้ไข</span>การข้อมูลสัญญาได้
        เนื่องจากมีการใช้สัญญาร่วมกันหลายโรงเรียน
      </p>
      <button onClick={onSubmit} type="button" className="btn btn-danger w-fit gap-2.5">
        <IconTask />
        เผยแพร่
      </button>
    </div>
  );
}

export default AffiliationContractConfirmForm;
