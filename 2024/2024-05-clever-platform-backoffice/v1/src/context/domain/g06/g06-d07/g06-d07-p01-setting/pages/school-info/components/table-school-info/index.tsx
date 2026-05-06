import { IUserData } from '@domain/g00/g00-d00/local/type';
import API from '@domain/g01/g01-d04/local/api';
import { SchoolByIdResponse } from '@domain/g01/g01-d04/local/type';
import showMessage from '@global/utils/showMessage';
import { DataTable } from 'mantine-datatable';
import { ReactNode, useEffect, useMemo, useState } from 'react';

type TableSchoolInfoProps = {
  userData: IUserData;
};

// million-ignore
const TableSchoolInfo = ({ userData }: TableSchoolInfoProps) => {
  const [school, setSchool] = useState<SchoolByIdResponse | null>(null);

  useEffect(() => {
    API.school
      .GetById(userData.school_id)
      .then((res) => {
        setSchool(res);
      })
      .catch((err) => {
        showMessage('พบปัญหาในการนำเข้าข้อมูลโรงเรียน', 'error');
      });
  }, [userData.school_id]);

  const mapAffiliationGroup = (value?: string | null): string => {
    switch (value) {
      case 'สพฐ':
        return 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน';
      case 'สนศ. กทม.':
        return 'สำนักการศึกษา กรุงเทพมหานคร';
      case 'สช':
        return 'สำนักงานคณะกรรมการส่งเสริมการศึกษาเอกชน';
      case 'อปท':
        return 'องค์กรปกครองส่วนท้องถิ่น';
      default:
        return 'อื่นๆ';
    }
  };

  const data = useMemo<{ label: string; value?: ReactNode }[]>(() => {
    return [
      { label: 'โรงเรียน', value: school?.name },
      {
        label: 'สังกัดระดับกรม',
        value: mapAffiliationGroup(school?.school_affiliation_group),
      },
      { label: 'ตำบล/แขวง', value: school?.sub_district },
      { label: 'อำเภอ/เขต', value: school?.district },
      { label: 'จังหวัด', value: school?.province },
      { label: 'สังกัดระดับจังหวัด/เขตพื้นที่', value: school?.school_affiliation_name },
      { label: 'ผู้อำนวยการ', value: school?.director },
      { label: 'รองผู้อำนวยการ', value: school?.deputy_director },
      { label: 'นายทะเบียน', value: school?.registrar },
      { label: 'หัวหน้าวิชาการโรงเรียน', value: school?.academic_affair_head },
      { label: 'ครูประจำชั้น/ครูที่ปรึกษา', value: school?.advisor },
    ];
  }, [school]);

  return (
    <DataTable
      records={data}
      idAccessor="label"
      noHeader
      striped
      stripedColor="#f5f5f5"
      withTableBorder
      withColumnBorders
      borderColor="#f5f5f5"
      style={{}}
      columns={[{ accessor: 'label' }, { accessor: 'value' }]}
    />
  );
};

export default TableSchoolInfo;
