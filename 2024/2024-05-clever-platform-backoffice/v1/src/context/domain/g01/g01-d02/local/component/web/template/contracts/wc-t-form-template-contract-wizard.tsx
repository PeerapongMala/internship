import { useState } from 'react';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconFileText1 from '@core/design-system/library/component/icon/IconFileText1';
import IconGroup from '@core/design-system/library/component/icon/IconGroup';
import IconHome from '@core/design-system/library/component/icon/IconHome';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import AffiliationContractAddSchoolFormTable from './wc-t-contract-add-school-form-table';
import AffiliationContractAddSubjectFormTable from './wc-t-contract-add-subject-form-table';
import AffiliationContractConfirmForm from './wc-t-contract-confirm-form';
import WizardBar from '../../organism/wc-o-wizardbar';
import { toDateTimeTH } from '@global/utils/date';
import {
  AffiliationContract,
  CreatedAffiliationContract,
  UpdatedAffiliationContract,
} from '@domain/g01/g01-d02/local/type';
import { useAffiliationContractDetailForm } from './wc-t-contract-detail-form';
import API from '@domain/g01/g01-d02/local/api';
import showMessage from '@global/utils/showMessage';
import { useRouter } from '@tanstack/react-router';
import ModalAction from '../../organism/wc-o-modal-action';

interface FormTemplateContractWizardProps {
  affiliationId: string;
  contractId?: string;
}

function FormTemplateContractWizard({
  affiliationId,
  contractId,
}: FormTemplateContractWizardProps) {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {
    FormUI: AffiliationContractDetailForm,
    watch,
    handleSubmit,
    setWizardIndex,
    setLastUpdated,
  } = useAffiliationContractDetailForm({ contractId });

  const lastUpdateDate = watch('updated_at');
  const lastUpdateBy = watch('updated_by');

  function onContractSave(data: Partial<AffiliationContract>) {
    if (data && affiliationId) {
      if (!data.id) {
        const bodyData: Partial<CreatedAffiliationContract> = {
          ...data,
          school_affiliation_id: affiliationId,
          start_date: new Date(data.start_date!).toISOString(),
          end_date: new Date(data.end_date!).toISOString(),
        };
        API.affiliationContract
          .Create(bodyData)
          .then((res) => {
            if (res.status_code === 201) {
              const { data } = res;
              setLastUpdated(data?.updated_at ?? '-', data?.created_by ?? '');

              //รอเปลี่ยนแปรงว่าจะเอายังไง
              router.navigate({
                to: '../$contractId',
                params: {
                  contractId: data?.id,
                },
              });
              showMessage('บันทึกสำเร็จ', 'success');
            } else {
              showMessage(res.message, 'error');
            }
          })
          .catch((err) => {
            console.error(err);
            setStep(1);
          });
      } else if (contractId) {
        const bodyData: Partial<UpdatedAffiliationContract> = {
          ...data,
          start_date: new Date(data.start_date!).toISOString(),
          end_date: new Date(data.end_date!).toISOString(),
        };
        API.affiliationContract
          .Update(+contractId, bodyData)
          .then((res) => {
            if (res.status_code === 201 || res.status_code == 200) {
              const { data } = res;
              setLastUpdated(data?.updated_at ?? '-', data?.created_by ?? '');
              showMessage('บันทึกสำเร็จ', 'success');
            } else {
              showMessage(res.message, 'error');
            }
          })
          .catch((err) => {
            console.error(err);
            setStep(1);
          });
      }
    }
  }
  return (
    <form onSubmit={handleSubmit(onContractSave)} className="flex flex-col gap-y-5">
      <div className="bg-white px-12 py-5">
        <WizardBar
          step={step}
          setStep={(step: number) => {
            setStep(step);
            setWizardIndex(step);
          }}
          tabs={[
            { id: 1, label: '1. ข้อมูลสัญญา', icon: <IconFileText1 /> },
            { id: 2, label: '2. เพิ่มโรงเรียน', icon: <IconHome /> },
            { id: 3, label: '3. เพิ่มหลักสูตร', icon: <IconGroup /> },
            { id: 4, label: '4. เผยแพร่', icon: <IconEye /> },
          ]}
        />
      </div>
      {/** content container */}
      <div className="flex flex-col gap-6 rounded-md bg-white p-4 shadow">
        {step === 1 && (
          <AffiliationContractDetailForm className="lg:max-w-[75%] xl:max-w-[50%]" />
        )}
        {step === 2 && (
          <AffiliationContractAddSchoolFormTable
            affiliationId={affiliationId}
            contractId={contractId}
          />
        )}
        {step === 3 && (
          <AffiliationContractAddSubjectFormTable
            affiliationId={affiliationId}
            contractId={contractId}
          />
        )}
        {step === 4 && <AffiliationContractConfirmForm contractId={contractId} />}
      </div>
      <div className="flex justify-between rounded-md bg-neutral-100 p-2.5">
        <div className="flex items-center gap-4">
          {step == 1 && (
            <>
              {/* <button type="submit" className="btn btn-primary flex w-32">
                บันทึก
              </button> */}
              {/* <button type="button" className="btn btn-outline-primary flex w-32">
                ยกเลิก
              </button> */}
            </>
          )}
          <div>
            แก้ไขล่าสุด:{' '}
            {lastUpdateDate && lastUpdateBy
              ? `${toDateTimeTH(lastUpdateDate)}, ${lastUpdateBy}`
              : '-'}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {step > 2 && (
            <button
              type="button"
              className="btn btn-primary flex w-32 gap-2"
              onClick={() => {
                setStep((prev) => prev - 1);
              }}
            >
              <IconCaretDown className="rotate-90" />
              ย้อนกลับ
            </button>
          )}
          {step === 2 && contractId && (
            <button
              type="button"
              className="btn btn-primary flex w-32 gap-2"
              onClick={() => {
                setStep((prev) => prev - 1);
              }}
            >
              <IconCaretDown className="rotate-90" />
              ย้อนกลับ
            </button>
          )}
          {/* {step === 1 && (
            <button
              type="submit"
              className="btn btn-primary flex w-32 gap-2"
              onClick={() => {
                setStep((prev) => prev + 1);
              }}
            >
              <IconCaretDown className="-rotate-90" />
              ต่อไปนะ
            </button>
          )} */}
          {step === 1 && !contractId && (
            <button
              type="button"
              className="btn btn-primary flex w-32 gap-2"
              onClick={() => {
                handleSubmit((data: any) => {
                  onContractSave(data);
                  setIsModalOpen(false);
                  setStep((prev) => prev + 1);
                })();
              }}
            >
              บันทึก
              <IconCaretDown className="-rotate-90" />
            </button>
          )}

          {step === 1 && contractId && (
            <button
              type="submit"
              className="btn btn-primary flex w-32 gap-2"
              onClick={() => {
                setStep((prev) => prev + 1);
              }}
            >
              ต่อไป
              <IconCaretDown className="-rotate-90" />
            </button>
          )}
          {step < 4 && step !== 1 && (
            <button
              type="button"
              className="btn btn-primary flex w-32 gap-2"
              onClick={() => {
                setStep((prev) => prev + 1);
              }}
            >
              ต่อไป <IconCaretDown className="-rotate-90" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default FormTemplateContractWizard;
