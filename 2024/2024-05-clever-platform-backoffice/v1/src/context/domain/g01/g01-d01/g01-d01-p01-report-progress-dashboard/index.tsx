import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';

import CWMTabs from '@component/web/molecule/cw-n-tabs';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { Thai } from 'flatpickr/dist/l10n/th';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import CWButton from '@component/web/cw-button';
import DashboardBarChartTemplate from './component/web/template/cw-t-dashboard-bar-chart';
import ProgressTemplate, {
  ExportProgressDataType,
} from './component/web/template/cw-t-progress';
import SchoolTemplate, {
  ExportSchoolDataType,
} from './component/web/template/cw-t-school';
import { useNavigate } from '@tanstack/react-router';
import { useDateRangeStore } from '../local/api/repository/stores';
import CWSelect from '@component/web/cw-select';
import { pdf } from '@react-pdf/renderer';
import DocumentPDF from './component/web/page/cw-p-report-progress-pdf';
import ApexCharts from 'apexcharts';
import dayjs from 'dayjs';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWALoadingOverlay from '@component/web/atom/cw-a-loading-overlay';
import { useLoadingApiStore } from '@store/useLoadingApiStore';

export interface ChildDataType {
  DashboardBarChartTemplateData?: ExportProgressDataType;
  ProgressTemplateData?: Array<ExportProgressDataType>;
  SchoolTemplateData?: Array<ExportSchoolDataType>;
  DashboardBarChartTemplateImg?: string;
  ProgressTemplateImg?: Array<string>;
  TeacherData?: any;
  StudentData?: any;
  StudentChartImg?: string;
}

const DomainJSX = () => {
  const navigate = useNavigate();
  const { startDate, endDate, setStartDate, setEndDate } = useDateRangeStore();

  const [selectedSchool, setSelectedSchool] = useState<string | undefined>('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [firstLoadCounter, setFirstLoadCounter] = useState(0);
  const { apiLoadingList } = useLoadingApiStore();

  useEffect(() => {
    if (firstLoadCounter < 3) {
      return;
    }

    if (apiLoadingList.length == 0) {
      setIsFirstLoad(false);
    }
  }, [apiLoadingList]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [selectedTab, setSelectedTab] = useState<string>('');
  const [selectedFirstDate, setSelectedFirstDate] = useState<string>(
    startDate?.toString() || '',
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string>(
    endDate?.toString() || '',
  );
  const [childData, setChildData] = useState<ChildDataType>({
    DashboardBarChartTemplateData: undefined,
    ProgressTemplateData: undefined,
    DashboardBarChartTemplateImg: undefined,
    ProgressTemplateImg: undefined,
    TeacherData: undefined,
  });

  const reportTypeOptions = [
    { key: 'obec', scope: 'inspection-area', value: 'สพฐ.', label: 'สพฐ.' },
    { key: 'doe', scope: 'district-zone', value: 'สนศ. กทม.', label: 'สนศ. กทม.' },
    { key: 'lao', scope: 'province', value: 'อปท.', label: 'อปท.' },
    { key: 'opec', scope: 'opec-school', value: 'สช.', label: 'สช.' },
    { key: 'etc', scope: 'etc-school', value: 'อื่นๆ', label: 'อื่นๆ' },
  ];

  const tabsList = [
    { key: '', label: 'รายงานความก้าวหน้า', url: '/admin/report/progress-dashboard' },
    { key: 'obec', label: 'Report สพฐ.', url: '/admin/report/report-obec' },
    { key: 'doe', label: 'Report สนศ. กทม.', url: '/admin/report/report-doe' },
    { key: 'lao', label: 'Report อปท.', url: '/admin/report/report-lao' },
    { key: 'opec', label: 'Report สช.', url: '/admin/report/report-opec' },
    { key: 'other', label: 'อื่นๆ', url: '/admin/report/report-other' },
  ];

  const [selectedReportType, setSelectedReportType] = useState(reportTypeOptions[0]);
  const [selectedProgressScope, setSelectedProgressScope] = useState();

  const handleTab = (index: number) => {
    setSelectedTab(tabsList[index].key);
    navigate({ to: `/${tabsList[index].url}` });
  };

  const getChartImage = async (chartID: string) => {
    const { imgURI } = await ApexCharts.exec(chartID, 'dataURI');
    return imgURI;
  };
  /*const setChartImageData = async () => {
    
    setChildData((prev) => ({
      ...prev,
      DashboardBarChartTemplateImg: dbcData,
      ProgressTemplateImg: ptcData,
    }));
  };*/

  const downloadPdf = async () => {
    if (!childData.DashboardBarChartTemplateData || !childData.ProgressTemplateData) {
      return;
    }
    const sscData = await getChartImage(childData.StudentData.chartID);
    const dbcData = await getChartImage(childData.DashboardBarChartTemplateData.chartID);
    const ptcData = await Promise.all(
      childData.ProgressTemplateData!.map(async (p) => await getChartImage(p.chartID)),
    );
    const blob = await pdf(
      <DocumentPDF
        childData={{
          ...childData,
          DashboardBarChartTemplateImg: dbcData,
          ProgressTemplateImg: ptcData,
          StudentChartImg: sscData,
        }}
      />,
    ).toBlob();
    const url = URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `report_progress-dashboard_${dayjs(selectedFirstDate).locale('th').format('YYYYMMDD')}-${dayjs(selectedEndDate).locale('th').format('YYYYMMDD')}.pdf`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    /*options.find((option) => option.value === selectedValue)?.scope;
    console.log(selectedValue);
    console.log(options);*/
  }, [selectedReportType]);

  const handleReportTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const match = reportTypeOptions.find((o) => o.value == event.target.value);
    if (match) {
      setSelectedReportType(match);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        className={
          isFirstLoad && apiLoadingList.length > 0 ? 'relative h-screen w-full' : 'hidden'
        }
      >
        <CWALoadingOverlay visible={true} />
      </div>

      <div className={isFirstLoad && apiLoadingList.length > 0 ? 'hidden' : ''}>
        <CWBreadcrumbs
          links={[
            {
              label: 'รายงาน',
              href: '/',
              disabled: true,
            },
            {
              label: 'รายงานความก้าวหน้า',
              href: '/',
            },
          ]}
        />
        <div>
          <h1 className="text-2xl font-bold">รายงานความก้าวหน้า</h1>
        </div>
        <div className="mb-3 grid w-full grid-cols-4 items-center gap-2">
          <WCAInputDateFlat
            placeholder="วว/ดด/ปปปป - วว/ดด/ปปปป"
            options={{
              mode: 'range',
              dateFormat: 'd/m/Y',
              locale: {
                ...Thai,
              },
            }}
            value={[selectedFirstDate, selectedEndDate]}
            onChange={(dates) => {
              setSelectedFirstDate(dates[0]?.toISOString() || '');
              setSelectedEndDate(dates[1]?.toISOString() || '');
              setStartDate(dates[0]?.toISOString() || '');
              setEndDate(dates[1]?.toISOString() || '');
            }}
          />
        </div>
        <CWMTabs
          items={tabsList.map((t) => t.label)}
          currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
          onClick={(index) => handleTab(index)}
        />
        <div className="mb-3 grid w-full grid-cols-4 flex-col items-center gap-2"></div>
        <DashboardBarChartTemplate
          reportType={selectedReportType.key}
          selectedRecordLabel={selectedReportType?.label ?? '-'}
          scope={selectedReportType.scope}
          startDate={selectedFirstDate}
          endDate={selectedEndDate}
          setChildData={setChildData}
          onFetchSuccess={() => {
            setFirstLoadCounter((prev) => prev + 1);
          }}
        />
        <ProgressTemplate
          reportType={selectedReportType.key}
          startDate={selectedFirstDate}
          endDate={selectedEndDate}
          setChildData={setChildData}
          setSelectedProgressScope={setSelectedProgressScope}
          onSelectSchool={setSelectedSchool}
          reportTypeOptions={reportTypeOptions}
          selectedReportType={selectedReportType}
          onReportTypeChange={handleReportTypeChange}
          onDownloadPdf={downloadPdf}
          onFetchSuccess={() => {
            setFirstLoadCounter((prev) => prev + 1);
          }}
        />

        <SchoolTemplate
          selectedSchool={selectedSchool}
          reportType={selectedReportType.key}
          startDate={selectedFirstDate}
          endDate={selectedEndDate}
          setChildData={setChildData}
          selectedProgressScope={selectedProgressScope}
          onFetchSuccess={() => {
            setFirstLoadCounter((prev) => prev + 1);
          }}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
