import StoreGlobal from '@global/store/global';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import { Link } from '@tanstack/react-router';

import { DataTable } from 'mantine-datatable';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import Box from '../local/components/atom/Box';
import WizardBar from '../local/components/organism/WizardBar';
import { tabs } from '../local/components/template/Tab';
import {
  rowData,
  rowColumns,
  rowData2,
  rowColumns2,
} from './component/web/template/DataTable';
import { useState } from 'react';
import { Select } from '@core/design-system/library/vristo/source/components/Input';
import FooterForm from '../local/components/organism/FooterForm';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const optionLanguage = [
    { value: 'th', label: 'ภาษาไทย' },
    { value: 'en', label: 'ภาษาอังกฤษ' },
    { value: 'cn', label: 'ภาษาจีน' },
  ];
  const [language, setLanguage] = useState(optionLanguage[0]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  return (
    <LayoutDefault>
      <div className="flex w-full flex-col gap-6 font-noto-sans-thai">
        <Box className="w-full rounded-lg bg-white p-5 shadow-md">
          <WizardBar tabs={tabs} />
        </Box>
        <Box className="flex flex-col gap-4">
          <Box className="flex flex-col items-center justify-center gap-2 bg-[#EAF1FF]">
            <div className="text-xl font-bold">ระบบช่วย Gen เสียงด้วย AI</div>
            <div>Lorem ipsum dolor sit amet consectetur. Urna in a.</div>
            <div className="flex gap-4">
              <button className="btn btn-primary w-40">สร้างเสียงด้วย AI</button>
              <button className="btn btn-outline-primary w-40 bg-white">
                ข้ามขั้นตอนนี้
              </button>
            </div>
          </Box>
          <div className="flex items-center justify-center gap-4 rounded-sm bg-gray-100 py-4 text-lg font-bold">
            <div>คำถามข้อที่</div>
            <button className="btn btn-primary h-11 w-11 !p-0">
              <IconCaretDown className="h-6 w-6 rotate-90" />
            </button>
            <div className="flex items-center gap-4">
              <input type="text" className="form-input !w-11 !text-lg" value={1} />
              <div>/ 3</div>
            </div>
            <button className="btn btn-primary h-11 w-11 !p-0">
              <IconCaretDown className="h-6 w-6 -rotate-90" />
            </button>
          </div>
          <div className="z-10 w-52">
            <Select
              label="เลือกภาษา"
              defaultValue={optionLanguage[0]}
              options={optionLanguage}
              value={language}
              onChange={(e) => setLanguage(e)}
              required
            />
          </div>
          <div className="datatables">
            <Table1 language={language} />
          </div>
          <div className="datatables">
            <Table2 language={language} />
          </div>
        </Box>
        <Box className="flex w-full justify-between rounded-lg bg-[#F5F5F5] p-5 shadow-md">
          {/* <FooterForm /> */}
          <></>
        </Box>
      </div>
    </LayoutDefault>
  );
};

const Table1 = ({ language }: { language: { value: string; label: string } }) => {
  const [selectedRecords, setSelectedRecords] = useState<any>([]);

  const newRowColumns = rowColumns.filter((column) => {
    if (column.accessor.includes('language')) {
      if (column.accessor.includes(language.value)) {
        return column;
      }
    } else {
      return column;
    }
  });
  return (
    <DataTable
      className="table-hover whitespace-nowrap"
      records={rowData}
      columns={newRowColumns}
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={setSelectedRecords}
      highlightOnHover
      withTableBorder
      withColumnBorders
    />
  );
};

const Table2 = ({ language }: { language: { value: string; label: string } }) => {
  const [selectedRecords, setSelectedRecords] = useState<any>([]);

  const newRowColumns = rowColumns2.filter((column) => {
    if (column.accessor.includes('language')) {
      if (column.accessor.includes(language.value)) {
        return column;
      }
    } else {
      return column;
    }
  });
  return (
    <DataTable
      className="table-hover whitespace-nowrap"
      records={rowData2}
      columns={newRowColumns}
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={setSelectedRecords}
      highlightOnHover
      withTableBorder
      withColumnBorders
    />
  );
};

export default DomainJSX;
