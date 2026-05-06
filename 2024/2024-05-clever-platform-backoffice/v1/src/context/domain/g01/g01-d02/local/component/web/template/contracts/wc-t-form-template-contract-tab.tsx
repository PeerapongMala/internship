import AffiliationContractAddSchoolFormTable from './wc-t-contract-add-school-form-table';
import { toDateTimeTH } from '@global/utils/date';
import {
  AffiliationContract,
  CreatedAffiliationContract,
  UpdatedAffiliationContract,
  UseStatus,
} from '@domain/g01/g01-d02/local/type';
import { useAffiliationContractDetailForm } from './wc-t-contract-detail-form';
import LinkTabs from '../../molecule/wc-m-link-tabs';
import { useLocation, useNavigate } from '@tanstack/react-router';
import API from '@domain/g01/g01-d02/local/api';
import SelectRegister from '../../molecule/wc-m-select-register';
import AffiliationContractViewSubjectTable from './wc-t-contract-view-subject-table';
import showMessage from '@global/utils/showMessage';

interface FormTemplateContractWizardProps {
  affiliationId: string;
  contractId: string;
}

function FormTemplateContractTab({
  affiliationId,
  contractId,
}: FormTemplateContractWizardProps) {
  const { hash: hashLocation } = useLocation();

  const {
    FormUI: AffiliationContractDetailForm,
    register: registerContract,
    watch: watchContract,
    handleSubmit: handleContractSubmit,
  } = useAffiliationContractDetailForm({ contractId });

  const contract = watchContract();
  const navigate = useNavigate();
  function onContractSave(data: Partial<AffiliationContract>) {
    if (data) {
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
            if (res.status_code == 200 || res.status_code == 201) {
              showMessage('บันทึกสำเร็จ', 'success');
            } else {
              showMessage(res.message, 'error');
            }
          })
          .catch((err) => console.error(err));
      } else if (contractId) {
        const updateData = {
          status: data.status,
        };
        const bodyData: Partial<UpdatedAffiliationContract> = {
          status: updateData.status,
        };
        API.affiliationContract
          .Update(+contractId, bodyData)
          .then((res) => {
            if (res.status_code == 200 || res.status_code == 201) {
              showMessage('บันทึกสำเร็จ', 'success');
              navigate({ to: '../' });
            } else {
              showMessage(res.message, 'error');
            }
          })
          .catch((err) => console.error(err));
      }
    }
  }

  return (
    <div className="flex flex-col gap-y-5">
      <LinkTabs
        tabs={[
          {
            label: 'ข้อมูลสัญญา',
            href: `#`,
            active: hashLocation !== 'schools' && hashLocation !== 'subjects',
          },
          {
            label: 'รายชื่อโรงเรียน',
            href: `#schools`,
            active: hashLocation === 'schools',
          },
          {
            label: 'รายชื่อหลักสูตร',
            href: `#subjects`,
            active: hashLocation === 'subjects',
          },
        ]}
      />

      {/** content container */}
      {hashLocation !== 'schools' && hashLocation !== 'subjects' && (
        <form onSubmit={handleContractSubmit(onContractSave)}>
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex flex-1 flex-col gap-6 rounded-md bg-white p-4 shadow">
              <AffiliationContractDetailForm />
            </div>
            <div className="flex h-fit min-w-[440px] flex-col gap-4 rounded-md bg-white p-4 shadow">
              <div className="grid grid-cols-2 items-center gap-y-4">
                <div>รหัสสังกัด:</div>
                <div>{contract.id}</div>
                <div>สถานะ</div>
                <div>
                  <SelectRegister
                    register={registerContract('status', {
                      required: true,
                      // disabled: contract?.status == 'enabled',
                    })}
                    selectedValue={watchContract('status')}
                    options={[
                      {
                        label: 'ใช้งาน',
                        value: UseStatus.IN_USE,
                      },
                      {
                        label: 'ไม่ใช้งาน',
                        value: UseStatus.NOT_IN_USE,
                      },
                    ]}
                  />
                </div>
                <div>แก้ไขล่าสุด</div>
                <div>
                  {contract?.updated_at ? toDateTimeTH(contract?.updated_at) : '-'}
                </div>
                <div>แก้ไขล่าสุดโดย</div>
                <div>{contract?.updated_by ?? '-'}</div>
              </div>
              <button
                type="button"
                disabled={!contractId}
                className="btn btn-primary"
                onClick={() => {
                  const formData = watchContract();
                  onContractSave(formData);
                }}
              >
                บันทึก
              </button>
            </div>
          </div>
        </form>
      )}
      {hashLocation === 'schools' && (
        <div className="flex flex-col gap-6 rounded-md bg-white p-4 shadow">
          <AffiliationContractAddSchoolFormTable
            affiliationId={affiliationId}
            contractId={contractId}
          />
        </div>
      )}
      {hashLocation === 'subjects' && (
        <div className="flex flex-col gap-6 rounded-md bg-white p-4 shadow">
          <AffiliationContractViewSubjectTable
            affiliationId={affiliationId}
            contractId={contractId}
          />
        </div>
      )}
    </div>
  );
}

export default FormTemplateContractTab;
