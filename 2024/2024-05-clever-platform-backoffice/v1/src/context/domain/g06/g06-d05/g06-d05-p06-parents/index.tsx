import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import styles from './index.module.css';
import { IGetPhorpor5Detail, GuardianInfo } from '../local/api/type';
import API from '../local/api';
import Content from '../local/component/web/atom/Content';
import { useParams } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';

interface Parent {
  student_name: string;
  no: number;
  parent: {
    name: string;
    relationship: string;
    profession: string;
    address: string;
  };
}

const DomainJSX = () => {
  const { evaluationForm }: { evaluationForm: TEvaluationForm } =
    StoreGlobalPersist.StateGet(['evaluationForm']);

  const [parentList, setParentList] = useState<Parent[]>([]);
  const { evaluationFormId, path } = useParams({
    strict: false,
  });

  useEffect(() => {
    if (evaluationFormId) {
      fetchData();
    }
  }, [evaluationFormId]);

  const fetchData = async () => {
    API.GetDetailPhorpor5(evaluationFormId, path, {}).then(async (res) => {
      if (res?.status_code === 200) {
        const guardianData = res.data[0].data_json as GuardianInfo[];
        const formattedParents = guardianData.map((guardian) => ({
          student_name: `${guardian.title}${guardian.first_name} ${guardian.last_name}`,
          no: guardian.no,
          parent: {
            name: `
            ${guardian.guardian_title}
            ${guardian.guardian_first_name} 
            ${guardian.guardian_last_name}
            `,
            relationship: guardian.guardian_relation,
            profession: guardian.guardian_occupation,
            address: `
            ${guardian.address_no} 
            หมู่ ${guardian.address_moo} 
            ${guardian.address_sub_district} 
            ${guardian.address_district} 
            ${guardian.address_province} 
            ${guardian.address_postal_code}
            `,
          },
        }));
        setParentList(formattedParents);
      }
    });
  };

  return (
    <div>
      <Content>
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th
                  colSpan={6}
                >{`${evaluationForm?.year} ปีการศึกษา ${evaluationForm?.academic_year}`}</th>
              </tr>
              <tr>
                <th>ชื่อ - สกุล</th>
                <th>เลขที่</th>
                <th>ผู้ปกครอง</th>
                <th>ความเกี่ยวข้อง</th>
                <th>อาชีพ</th>
                <th>ที่อยู่</th>
              </tr>
            </thead>
            <tbody>
              {parentList.map((data, index) => (
                <tr key={index}>
                  <td>{data.student_name}</td>
                  <td>{data.no}</td>
                  <td>{data.parent.name}</td>
                  <td>{data.parent.relationship}</td>
                  <td>{data.parent.profession}</td>
                  <td>{data.parent.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Content>
    </div>
  );
};

export default DomainJSX;
