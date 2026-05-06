import CWWhiteBox from '@global/component/web/cw-white-box';
import CWSelect from '@global/component/web/cw-select';
import {
  getAdministrativeRoleOptions as role,
  isAdministrativeKey,
  TObserverAccesses,
  ADMINISTRATIVE_ROLES,
  getAdministrativeRoleInThai,
  getAdministrativeRole,
} from '@domain/g01/g01-d09/local/helpers/admin-report-permission';
import SelectDistrict from '../../molecule/cw-m-select-district';
import SelectDistrictGroup from '../../molecule/cw-m-select-district-group';
import SelectInspectArea from '../../molecule/cw-m-select-inspect-area';
import SelectInspectAreaOffice from '../../molecule/cw-m-select-inspect-area-office';
import SelectSchoolAffiliationId from '../../molecule/cw-m-select-id-school-affiliations';
import SelectTypeSchoolAffiliation from '../../molecule/cw-m-select-school-affiliations-type';
import SelectLaoType from '../../molecule/cw-m-select-lao-type';
import SelectLaoId from '../../molecule/cw-m-select-lao-id';

type EditAccessActionProps = {
  form: TObserverAccesses;
  handleSetForm: <K extends keyof TObserverAccesses>(
    field: K,
    value: TObserverAccesses[K],
  ) => void;
};

const EditAccessAction = ({ form, handleSetForm }: EditAccessActionProps) => {
  const options: { label: string; value: string }[] = Object.keys(
    ADMINISTRATIVE_ROLES,
  ).map((key, i) => {
    return {
      label: getAdministrativeRoleInThai(key as keyof typeof ADMINISTRATIVE_ROLES),
      value: getAdministrativeRole(key as keyof typeof ADMINISTRATIVE_ROLES),
    };
  });

  return (
    <CWWhiteBox className="flex flex-col gap-4 p-4">
      <span className="font-bold">ตั้งค่าสิทธิ์การเข้าถึง</span>
      <div className="flex flex-row gap-4">
        <CWSelect
          className="w-full max-w-[265px]"
          options={options}
          value={form.accessName}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleSetForm('accessName', e.target.value)
          }
        />

        {/* ผู้บริหาร สพป. */}
        {isAdministrativeKey(
          form.accessName,
          ADMINISTRATIVE_ROLES.primaryEdServiceAreaExecutives,
        ) && (
          <>
            <SelectInspectArea
              value={form.districtZone}
              onChange={(inspectArea) => {
                handleSetForm('districtZone', inspectArea);
                handleSetForm('areaOffice', undefined);
              }}
            />

            <SelectInspectAreaOffice
              value={form.areaOffice}
              inspectArea={form.districtZone}
              onChange={(iArea) => handleSetForm('areaOffice', iArea)}
            />
          </>
        )}

        {/* ผู้บริหาร กลุ่มเขต */}
        {isAdministrativeKey(
          form.accessName,
          ADMINISTRATIVE_ROLES.regionalGroupExecutives,
        ) && (
          <SelectDistrictGroup
            value={form.districtGroup}
            onChange={(districtGroup) => {
              handleSetForm('districtGroup', districtGroup);
              handleSetForm('district', undefined);
            }}
          />
        )}

        {/* ผู้บริหาร เขตพื้นที่ */}
        {isAdministrativeKey(form.accessName, ADMINISTRATIVE_ROLES.areaExecutives) && (
          <>
            <SelectDistrictGroup
              value={form.districtGroup}
              onChange={(districtGroup) => {
                handleSetForm('districtGroup', districtGroup);
                handleSetForm('district', undefined);
              }}
            />

            <SelectDistrict
              value={form.district}
              districtGroup={form.districtGroup}
              onChange={(district) => handleSetForm('district', district)}
            />
          </>
        )}

        {/* ผู้บริหารเครือโรงเรียนประเภท (สช) */}
        {isAdministrativeKey(
          form.accessName,
          ADMINISTRATIVE_ROLES.privateEdCommissionExecutives,
        ) && (
          <>
            <SelectTypeSchoolAffiliation
              value={form.schoolAffiliationType}
              onChange={(value) => {
                handleSetForm('schoolAffiliationType', value);
                handleSetForm('schoolAffiliationId', undefined);
              }}
            />
            <SelectSchoolAffiliationId
              type={form.schoolAffiliationType}
              value={form.schoolAffiliationId}
              onChange={(id) => handleSetForm('schoolAffiliationId', id)}
            />
          </>
        )}

        {/* ผู้บริหาร เทศบาล */}
        {isAdministrativeKey(
          form.accessName,
          ADMINISTRATIVE_ROLES.municipalExecutives,
        ) && (
          <>
            <SelectLaoType
              value={form.schoolAffiliationType}
              onChange={(type) => {
                handleSetForm('schoolAffiliationType', type);
                handleSetForm('schoolAffiliationId', undefined);
              }}
            />
            <SelectLaoId
              value={form.schoolAffiliationId}
              onChange={(type) => handleSetForm('schoolAffiliationId', type)}
              type={form.schoolAffiliationType}
            />
          </>
        )}
      </div>
    </CWWhiteBox>
  );
};

export default EditAccessAction;
