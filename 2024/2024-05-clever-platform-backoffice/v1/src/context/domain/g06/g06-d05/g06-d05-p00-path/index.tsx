import LayoutDefault from '@core/design-system/library/component/layout/default';
import HeaderG0605 from '../local/component/web/template/HeaderG0605';
import StoreGlobalVolatile from '@store/global/volatile';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

// Import components
import DomainJSX01 from '../g06-d05-p01-course/index';
import DomainJSX02 from '../g06-d05-p02-phorpor5-course/index';
import DomainJSX03 from '../g06-d05-p03-phorpor5-class/index';
import DomainJSX04 from '../g06-d05-p04-students/index';
import DomainJSX05 from '../g06-d05-p05-father-mother/index';
import DomainJSX06 from '../g06-d05-p06-parents/index';
import DomainJSX07 from '../g06-d05-p07-class-time/index';
import DomainJSX08 from '../g06-d05-p08-nutritional-summary/index';
import DomainJSX09 from '../g06-d05-p09-learning-outcomes/index';
import DomainJSX10 from '../g06-d05-p10-desired-attributes/index';
import DomainJSX11 from '../g06-d05-p11-competencies/index';
import DomainJSX12 from '../g06-d05-p12-student-development-activities/index';
import RestAPI from '../local/api/infrastructure/restapi';
import { GetEvaluationForm } from '../local/api/type';
import ModalCreateForm from '@domain/g06/g06-d06/local/component/web/shared/ModalCreateForm';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import StoreGlobal from '@store/global';
import LayoutEvaluationForm from '@domain/g06/local/components/web/template/cw-t-layout-evaluation';

const DomainJSX = () => {
  const { evaluationFormId, path } = useParams({
    strict: false,
  });
  const navigate = useNavigate();
  const { phorpor5Tabs }: { phorpor5Tabs: any } = StoreGlobalVolatile.StateGet([
    'phorpor5Tabs',
  ]);

  const [modal, setModal] = useState<boolean>(false);
  const [selectPage, setSelectPage] = useState<string>('');
  const [breadcrumb, setBreadcrumb] = useState<GetEvaluationForm | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (evaluationFormId) {
      fetchEvaluationForm();
    }
  }, [evaluationFormId]);

  const fetchEvaluationForm = async () => {
    try {
      setLoading(true);
      const res = await RestAPI.GetEvaluation(evaluationFormId);

      if (res.status_code === 200 && res.data) {
        setBreadcrumb(res.data);
        (
          StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
        ).setEvaluationForm(res.data);
      } else {
        console.error('Unexpected status code:', res.status_code);
      }
    } catch (error) {
      console.error('Failed to fetch breadcrumb:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phorpor5Tabs?.length > 0) {
      const tab = phorpor5Tabs.find((item: any) => Number(item.id) === Number(path));
      if (tab) {
        setSelectPage(tab.name);
      } else {
        const firstTab = phorpor5Tabs[0];
        setSelectPage(firstTab.name);
        navigate({
          to: `/grade-system/evaluation/report/${evaluationFormId}/phorpor5/${firstTab.id}`,
        });
      }
    }
    else {
      setSelectPage('');
    }
  }, [phorpor5Tabs, path]);

  const triggerModal = () => {
    setModal(!modal);
  };

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  const renderPage = () => {
    if (!loading && (!phorpor5Tabs || phorpor5Tabs.length === 0)) {
      return (
        <div className="flex w-full flex-col items-center justify-center gap-5 p-4 text-center">
          <p className="font-bold">คุณยังไม่ได้ออกรายงาน</p>
          <p>กรุณาตรวจสอบสถานะ เพื่อออกรายงาน</p>
          <CWButton
            onClick={triggerModal}
            title="สร้างรายงาน"
            icon={<IconPlus />}
            className="w-[200px]"
          />
        </div>
      );
    }

    if (!selectPage) {
      return (
        <div className="flex w-full items-center justify-center p-4 text-center text-gray-500">
          กำลังเตรียมข้อมูล...
        </div>
      );
    }
    switch (selectPage) {
      case 'รายวิชา':
        return <DomainJSX01 />;
      case 'ปก ปพ.5 รายชั้น':
        return <DomainJSX03 />;
      case 'ปก ปพ.5 รายวิชา':
        return <DomainJSX02 />;
      case 'ชื่อนักเรียน':
        return <DomainJSX04 />;
      case 'บิดา-มารดา':
        return <DomainJSX05 />;
      case 'ผู้ปกครอง':
        return <DomainJSX06 />;
      case 'เวลาเรียน':
        return <DomainJSX07 />;
      case 'ภาวะโภชนาการ':
        return <DomainJSX08 />;
      case 'ผลสัมฤทธิ์ทางการเรียน':
        return <DomainJSX09 />;
      case 'คุณลักษณะอันพึงประสงค์':
        return <DomainJSX10 />;
      case 'สมรรถนะ':
        return <DomainJSX11 />;
      case 'กิจกรรมพัฒนาผู้เรียน':
        return <DomainJSX12 />;
      default:
        return (
          <div className="flex w-full items-center justify-center p-4 text-center text-gray-500">
            ไม่พบหน้าที่คุณร้องขอ
          </div>
        );
    }
  };

  return (
    <LayoutEvaluationForm
      breadCrumbs={[{ label: 'สมุดบันทึกการพัฒนาคุณภาพผู้เรียน (ปพ.5)' }]}
    >
      <HeaderG0605 breadcrumb={breadcrumb} />
      {renderPage()}
      <ModalCreateForm
        open={modal}
        onClose={triggerModal}
        onCompleted={() => {
          setTimeout(() => {
            fetchEvaluationForm();
          }, 2100);
        }}
      />
    </LayoutEvaluationForm>
  );
};

export default DomainJSX;
