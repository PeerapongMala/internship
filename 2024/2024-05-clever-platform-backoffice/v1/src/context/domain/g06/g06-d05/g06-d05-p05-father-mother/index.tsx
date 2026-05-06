import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import { IGetPhorpor5Detail, ParentInfo } from '../local/api/type';
import API from '../local/api';
import Content from '../local/component/web/atom/Content';
import { useParams } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';

interface FormattedParentData {
  student_name: string;
  no: number;
  father: {
    name: string;
    profession: string;
  };
  mother: {
    name: string;
    profession: string;
  };
}

const DomainJSX = () => {
  const { evaluationForm }: { evaluationForm: TEvaluationForm } =
    StoreGlobalPersist.StateGet(['evaluationForm']);

  const [formattedData, setFormattedData] = useState<FormattedParentData[]>([]);
  const [originalData, setOriginalData] = useState<IGetPhorpor5Detail[]>([]);
  const { evaluationFormId, path } = useParams({
    strict: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (evaluationFormId) {
      fetchData();
    }
  }, [evaluationFormId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await API.GetDetailPhorpor5(evaluationFormId, path, {});
      if (res?.status_code === 200) {
        setOriginalData(res.data);
        const transformedData = res.data.flatMap((form) =>
          (form.data_json as ParentInfo[]).map((item) => ({
            student_name: `${item.title}${item.first_name} ${item.last_name}`,
            no: item.no,
            father: {
              name: `${item.father_title}${item.father_first_name} ${item.father_last_name}`,
              profession: item.father_occupation,
            },
            mother: {
              name: `${item.mother_title}${item.mother_first_name} ${item.mother_last_name}`,
              profession: item.mother_occupation,
            },
          })),
        );

        setFormattedData(transformedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Content>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th colSpan={7}>
                    {`${evaluationForm?.year} ปีการศึกษา ${evaluationForm?.academic_year}`}
                  </th>
                </tr>
                <tr>
                  <th>ที่</th>
                  <th>ชื่อ-สกุล</th>
                  <th>เลขที่</th>
                  <th>ชื่อสกุล บิดา</th>
                  <th>อาชีพ</th>
                  <th>ชื่อสกุล มารดา</th>
                  <th>อาชีพ</th>
                </tr>
              </thead>
              <tbody>
                {formattedData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.student_name}</td>
                    <td>{data.no}</td>
                    <td>{data.father.name}</td>
                    <td>{data.father.profession}</td>
                    <td>{data.mother.name}</td>
                    <td>{data.mother.profession}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Content>
    </div>
  );
};

export default DomainJSX;
