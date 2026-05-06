import CWWhiteBox from '@component/web/cw-white-box';
import { THandleTableTemplateList, TTemplateFilter } from '@domain/g06/g06-d07/local/types/template';
import { useRef, useState } from 'react';
import { TStudentFilter } from '@domain/g06/g06-d07/local/types/students';
import CWTableTemplateList from './components/cw-table-template-list';
import CWHeaderTemplate from './components/cw-header-template';
import { useNavigate } from '@tanstack/react-router';

const TemplateDocument = () => {
  const navigate = useNavigate()
  const tableRef = useRef<THandleTableTemplateList>(null);
  const [filter, setFilter] = useState<TTemplateFilter>({
    format_id: undefined,
    name: undefined
  });


  const handleSearch = (searchValue: string) => {
    setFilter(prev => ({
      ...prev,
      name: searchValue || undefined
    }));
  };
  const handleTemplateChange = (templateId: number | undefined) => {
    setFilter(prev => {
      if (templateId === undefined) {
        const { format_id, ...rest } = prev;
        return rest;
      }
      return { ...prev, format_id: templateId };
    });
  };

  return (
    <CWWhiteBox>
      <div className='flex flex-col'>
        <CWHeaderTemplate
          filter={filter}
          onCreate={() => navigate({ to: './document-template/create' })}
          onSearch={handleSearch}
          onTemplateChange={handleTemplateChange}
        />
        <CWTableTemplateList
          ref={tableRef}
          filter={filter}
          onEditTemplate={(teamplateId: number) => {
            navigate({ to: `./document-template/edit/${teamplateId}` })
          }}
        />
      </div>
    </CWWhiteBox>
  )
};

export default TemplateDocument;
