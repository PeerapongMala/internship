import { TObserverAccesses } from '@domain/g01/g01-d09/local/helpers/admin-report-permission';
import InputNamePermission from '../../atom/cw-a-input-name-permission';
import EditAccessAction from '../../organism/cw-o-edit-access-action';
import SaveEditAccessPanel from '../../organism/cw-o-edit-access-save-panel';
import API from '@domain/g01/g01-d09/local/api';
import { TAdminReportPermission } from '@domain/g01/g01-d09/local/api/helper/admin-report-permission';
import useStore from '@domain/g01/g01-d09/local/stores';
import showMessage from '@global/utils/showMessage';
import { useNavigate } from '@tanstack/react-router';

type AccessInfoTemplateProps = {
  formData: TObserverAccesses;
  handleFormDataChange: <K extends keyof TObserverAccesses>(
    field: K,
    value: TObserverAccesses[K],
  ) => void;
};

const AccessInfoTemplate = ({
  formData,
  handleFormDataChange,
}: AccessInfoTemplateProps) => {
  const obsFormStore = useStore.observerAccessForm();
  const navigate = useNavigate();
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let data: TAdminReportPermission;
    if (formData.id) {
      data = await API.adminReportPermissionAPI.PutArpObserverAccesses(formData.id, {
        access_name: formData.accessName,
        name: formData.name,
        status: formData.status,
        area_office: formData.areaOffice,
        district: formData.district,
        district_group: formData.districtGroup,
        district_zone: formData.districtZone,
        school_affiliation_id: formData.schoolAffiliationId,
      });
    } else {
      data = await API.adminReportPermissionAPI.PostArpObserverAccesses({
        access_name: formData.accessName,
        name: formData.name,
        status: formData.status,
        area_office: formData.areaOffice,
        district: formData.district,
        district_group: formData.districtGroup,
        district_zone: formData.districtZone,
        school_affiliation_id: formData.schoolAffiliationId,
      });
    }
    handleFormDataChange('id', data.id);
    obsFormStore.fetchAdminReportPermission(data.id);

    showMessage('บันทึกสำเร็จ! ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว', 'success');
    navigate({ to: '../' });
  };

  return (
    <form className="flex gap-[23px]" onSubmit={handleSave}>
      <div className="flex w-full flex-1 flex-col gap-8">
        <InputNamePermission
          accessName={formData.name}
          handleAccessNameChange={(value) => handleFormDataChange('name', value)}
        />
        <EditAccessAction form={formData} handleSetForm={handleFormDataChange} />
      </div>

      <SaveEditAccessPanel
        className="w-full max-w-[437px]"
        data={formData}
        onChange={(value) => handleFormDataChange('status', value)}
      />
    </form>
  );
};

export default AccessInfoTemplate;
