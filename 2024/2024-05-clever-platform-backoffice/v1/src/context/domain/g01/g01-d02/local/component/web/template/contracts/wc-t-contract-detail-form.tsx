import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import InputRegister from '@domain/g01/g01-d02/local/component/web/molecule/wc-m-input-register';
import { AffiliationContract, SeedPlatform } from '@domain/g01/g01-d02/local/type';
import { fromISODateToYYYYMMDD } from '@global/utils/date';
import {
  Control,
  Controller,
  useForm,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import Input from '../../atom/wc-a-input';
import API from '@domain/g01/g01-d02/local/api';
import CWSelect from '@component/web/cw-select';
import { useEffect, useState } from 'react';
import showMessage from '@global/utils/showMessage';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';

interface AffiliationContractDetailFormProps {
  register: UseFormRegister<Partial<AffiliationContract>>;
  watch: UseFormWatch<Partial<AffiliationContract>>;
  control: Control<Partial<AffiliationContract>>;
  className?: string;
}

function AffiliationContractDetailForm({
  register,
  watch,
  control,
  className,
}: AffiliationContractDetailFormProps) {
  const startDate = watch('start_date');
  const endDate = watch('end_date');
  const contractId = watch('id');
  const contractStatus = watch('status');
  const [seedPlatforms, setSeedPlatform] = useState<SeedPlatform[]>([]);

  useEffect(() => {
    API.affiliationContract.GetSeedPlatformList().then((res) => {
      if (res.status_code == 200) {
        setSeedPlatform(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, []);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/** affiliation contract details */}
      <span className="text-xl font-bold leading-8">ข้อมูลสัญญา</span>
      {/** first row */}
      <div>
        <label
          htmlFor="affiliation-contract-name-input"
          className="before:text-red-500 before:content-['*']"
        >
          ชื่อสัญญา
        </label>
        <InputRegister
          id="affiliation-contract-name-input"
          register={register('name', {
            required: true,
            disabled: contractStatus === 'enabled' || contractStatus === 'disabled',
          })}
          className={`${contractStatus == 'enabled' ? 'cursor-not-allowed text-neutral-400' : ''}`}
        />
      </div>

      {/** second row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="affiliation-contract-start-date-input"
            className="before:text-red-500 before:content-['*']"
          >
            วันที่เริ่มต้นสัญญา
          </label>
          <Controller
            control={control}
            name="start_date"
            rules={{ required: true, min: endDate }}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <WCAInputDateFlat
                  {...onBlur}
                  id="affiliation-contract-end-date-input"
                  placeholder="วว/ดด/ปปปป"
                  min={endDate}
                  onChange={onChange}
                  value={value ? fromISODateToYYYYMMDD(value) : ''}
                  disabled={contractStatus === 'enabled' || contractStatus === 'disabled'}
                />
              );
            }}
          />
        </div>
        <div>
          <label
            htmlFor="affiliation-contract-end-date-input"
            className="before:text-red-500 before:content-['*']"
          >
            วันที่สิ้นสุดสัญญา
          </label>

          <Controller
            control={control}
            name="end_date"
            rules={{ required: true, min: startDate }}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <WCAInputDateFlat
                  {...onBlur}
                  id="affiliation-contract-end-date-input"
                  placeholder="วว/ดด/ปปปป"
                  min={startDate}
                  onChange={onChange}
                  value={value ? fromISODateToYYYYMMDD(value) : ''}
                  disabled={contractStatus === 'enabled' || contractStatus === 'disabled'}
                />
              );
            }}
          />
        </div>
        <div>
          <label
            htmlFor="affiliation-contract-seed-platform-id-select"
            className="before:text-red-500 before:content-['*']"
          >
            แพลตฟอร์ม
          </label>
          <Controller
            control={control}
            name="seed_platform_id"
            rules={{ required: true, min: startDate }}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <CWSelect
                  onChange={onChange}
                  disabled={!!contractId}
                  options={seedPlatforms.map((platform) => ({
                    label: platform.name,
                    value: platform.id,
                  }))}
                  value={value}
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

interface UseAffiliationContractDetailFormProps {
  contractId?: string;
}

export function useAffiliationContractDetailForm({
  contractId,
}: UseAffiliationContractDetailFormProps) {
  const form = useForm<Partial<AffiliationContract>>({
    defaultValues: contractId
      ? () => {
          return API.affiliationContract.GetById(contractId).then((res) => {
            if (res.status_code === 200) {
              return res.data as Partial<AffiliationContract>;
            }
            return {};
          });
        }
      : {
          wizard_index: 1,
        },
  });
  const {
    register,
    reset,
    resetField,
    setValue,
    handleSubmit: formHandleSubmit,
    watch,
    control,
    formState: { errors },
  } = form;
  const handleSubmit = (onSubmit: any) => {
    return formHandleSubmit(onSubmit);
  };
  return {
    FormUI: ({ className }: { className?: string }) => (
      <AffiliationContractDetailForm
        register={register}
        watch={watch}
        control={control}
        className={className}
      />
    ),
    register,
    watch,
    setWizardIndex: (index: number) => {
      setValue('wizard_index', index);
    },
    setLastUpdated: (updateAt: string, updateBy: string) => {
      setValue('updated_at', updateAt);
      setValue('updated_by', updateBy);
    },
    handleSubmit,
  };
}
