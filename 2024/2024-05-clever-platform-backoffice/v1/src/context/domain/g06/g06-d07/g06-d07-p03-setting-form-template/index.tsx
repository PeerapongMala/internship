import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import CWTitleBack from '@component/web/cw-title-back';
import { getUserData } from '@global/utils/store/getUserData';
import StoreGlobal from '@store/global';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import CWFromTemplate, { CWTemplateSettingProps, CWTemplateSettingRef } from './components/page/form-template';
import CWButton from '@component/web/cw-button';
import { useDocumentTemplateList } from '../local/hook/getlist/useTemplatelist';

const DomainJSX = () => {
  const params: { template_id?: string } = useParams({ strict: false });
  const navigate = useNavigate();
  const userData = getUserData()
  const schoolId = userData?.school_id;

  const [mode, setMode] = useState<'create' | 'edit' | undefined>()
  const [initiateIsDefault, setInitiateIsDefault] = useState<boolean>()
  const [isDefault, setIsDefault] = useState<boolean>()

  const [isLoading, setIsLoading] = useState(false);



  const {
    template,
  } = useDocumentTemplateList();
  const checkLength = template && template.length === 0

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
    if (params.template_id) {
      setMode("edit")
    } else {
      setMode("create")
      // ตั้งค่า isDefault เป็น true เฉพาะเมื่อสร้างครั้งแรกและยังไม่มี template ใดๆ
      if (template && template.length === 0) {
        setIsDefault(true);
      } else {
        setIsDefault(false);
      }
    }
  }, [params.template_id, template]);

  const handledBack = () => {
    if (mode === 'edit') {
      navigate({ to: '../../../?tab=template' })
    } else if (mode === 'create') {
      navigate({ to: '../../?tab=template' })
    }
  }
  const formTemplateRef = useRef<CWTemplateSettingRef>(null);

  const handleSave = async () => {
    setIsLoading(true);
    if (formTemplateRef.current) {
      await formTemplateRef.current.handleSave();
      setIsLoading(false);
    }
  };

  const isCreateMode = mode === 'create';

  const checkDefaultButtonDisabled = () => {
    if (isCreateMode) {
      return template.length > 0;
    } else {
      return initiateIsDefault;
    }
  };

  const handleToggleDefault = () => {
    if (isCreateMode) {
      // craete สามารถ toggle ได้เฉพาะเมื่อเป็น template แรก 
      if (template && template.length === 0) {
        setIsDefault(!isDefault);
      }
    } else {
      // edit สามารถ toggle ได้ตลอดเวลา
      setIsDefault(!isDefault);
    }
  };

  return (
    <div className='w-full flex flex-col gap-5'>
      <CWBreadcrumbs
        showSchoolName
        links={[
          {
            href: '#',
            disabled: true,
            label: 'การเรียนการสอน',
          },
          {
            href: '/',
            label: 'ระบบตัดเกรด (ปพ.)',
            disabled: true,
          },
          {
            label: 'ตั้งค่า',
          },
        ]}
      />

      <CWSchoolCard
        code="0000001"
        name="โรงเรียนเกษม"
        subCode="xxx"
        image="/public/logo192.png"
      />

      <CWTitleBack
        label='ตั้งค่าระบบ'
        onClick={handledBack}
      />

      <CWFromTemplate
        ref={formTemplateRef}
        mode={mode}
        school_id={schoolId}
        idEdit={params.template_id}
        setInitiateIsDefault={setInitiateIsDefault}
        isDefault={isDefault}
        setIsDefault={setIsDefault}
        onLoadingChange={setIsLoading}
      />

      <div className='flex gap-5'>
        <CWButton
          title={'บันทึก'}
          className='w-[150px]'
          onClick={handleSave}
          disabled={isLoading}
          loading={isLoading}
        />
        <div className='flex gap-5'>
          <CWButton
            title={isDefault ? 'ยกเลิกค่าเริ่มต้น' : 'เลือกเป็นค่าเริ่มต้น'}
            variant='white'
            className='w-[150px]'
            disabled={checkDefaultButtonDisabled()}
            onClick={handleToggleDefault}
          />

          {isDefault && (
            <div className='flex items-center'>
              <p className='text-green-600 font-bold'>*เอกสารนี้เป็นค่าตั้งต้นแล้ว</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DomainJSX;
