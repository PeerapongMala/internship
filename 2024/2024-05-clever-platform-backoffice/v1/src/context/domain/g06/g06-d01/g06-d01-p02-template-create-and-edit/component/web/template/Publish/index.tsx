import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import IconTask from '@core/design-system/library/component/icon/IconTask';
import { Template } from '@domain/g06/g06-d01/g06-d01-p02-template-create-and-edit';
import API from '@domain/g06/g06-d01/local/api';
import { EStatusTemplate } from '@domain/g06/g06-d01/local/api/type';
import { EGradeTemplateType } from '@domain/g06/local/enums/evaluation';
import showMessage from '@global/utils/showMessage';
import { useNavigate } from '@tanstack/react-router';

type PublishProps = {
  template: Template;
};

const Publish = ({ template }: PublishProps) => {
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!template.id) {
      return;
    }

    let isGeneralTemplateSelected = true;
    Object.values(EGradeTemplateType).forEach((type) => {
      if (template.general_templates.find((template) => template.template_type == type)) {
        return;
      }
      isGeneralTemplateSelected = false;
    });

    if (!isGeneralTemplateSelected) {
      showMessage('โปรดเลือก Template แบบประเมินทั่วไปให้ครบถ้วน', 'warning');
      return;
    }

    const res = await API.Templates.Update(template.id, {
      template: {
        status: EStatusTemplate.published,
      },
    });

    if (res.status_code !== 200) {
      showMessage(res.message, 'error');
      return;
    }

    showMessage('เผยแพร่สำเร็จ');
    navigate({ to: '../..?step=2' });
  };

  return (
    <>
      <CWWhiteBox className="mb-5 flex flex-col justify-center text-center">
        <h1 className="text-[24px] font-bold">ตรวจสอบความเรียบร้อย</h1>
        <hr className="my-3" />
        <p>
          กรุณาตรวจสอบก่อนเผยแพร่ข้อมูล หลังจากที่เผยแพร่ข้อมมูลแล้ว
          <br />
          คุณจะ<u>ไม่สามารถแก้ไข</u>ข้อมูล template ใบตัดเกรดได้
        </p>
        <div className="mt-3 flex w-full justify-center">
          <CWButton
            variant={'danger'}
            title={'เผยแพร่'}
            onClick={() => {
              handlePublish();
            }}
            icon={<IconTask />}
          />
        </div>
      </CWWhiteBox>
    </>
  );
};

export default Publish;
