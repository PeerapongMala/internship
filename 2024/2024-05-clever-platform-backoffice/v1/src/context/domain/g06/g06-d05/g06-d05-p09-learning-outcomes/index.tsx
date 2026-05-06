import { useEffect } from 'react';

import Content from '../local/component/web/atom/Content';

import SubTab from './component/web/organism/Subtab';
import { useLocation, useParams } from '@tanstack/react-router';
import TablePage1 from './component/web/template/TablePage1';
import TablePage2 from './component/web/template/TablePage2';
import TablePage3 from './component/web/template/TablePage3';
import API from '../local/api';

const DomainJSX = () => {
  const location = useLocation();

  const page = location.search.page ? location.search.page.toString() : '1';

  const { evaluationFormId, path } = useParams({
    strict: false,
  });

  useEffect(() => {
    console.log(evaluationFormId);

    if (evaluationFormId) {
      fetchData();
    }
  }, [evaluationFormId]);

  const fetchData = async () => {
    API.GetDetailPhorpor5(evaluationFormId, path, {}).then(async (res) => {
      if (res?.status_code === 200) {
        console.log(res);
      }
    });
  };

  return (
    <div>
      <Content>
        <SubTab page={page} />

        {page === '1' && <TablePage1 evaluationFormId={evaluationFormId} id={path} />}

        {page === '2' && <TablePage2 evaluationFormId={evaluationFormId} id={path} />}

        {page === '3' && <TablePage3 evaluationFormId={evaluationFormId} id={path} />}
      </Content>
    </div>
  );
};

export default DomainJSX;
