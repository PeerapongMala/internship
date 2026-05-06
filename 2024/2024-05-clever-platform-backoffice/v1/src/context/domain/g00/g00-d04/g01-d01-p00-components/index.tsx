import StoreGlobal from '@global/store/global';
import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import FileUpload from '@core/design-system/library/vristo/source/components/FileUpload';

import CWWhiteBox from '@component/web/cw-white-box';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import CWInputSearch from '@component/web/cw-input-search';
import CWWizardBar from '@component/web/cw-wizard-bar';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import CWInputRadio from '@component/web/cw-input-radio';
import CWInputFile from '@component/web/cw-input-file';
import CWButtonSwitch from '@component/web/cw-button-switch';
import CWNeutralBox from '@component/web/cw-neutral-box';
import CWTitleGroup from '@component/web/cw-title-group';
import CWSchoolCard from '@component/web/cw-school-card';
import CWPagination from '@component/web/cw-pagination';
import CWButton from '@component/web/cw-button';
import CWSwitchTabs from '@component/web/cs-switch-taps';

import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWModalCreateMonster from '@component/web/cw-modal/cw-modal-create-monster';
import CWModalDisbanded from '@component/web/cw-modal/cw-modal-disbanded';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import CWModalMap from '@component/web/cw-modal/cw-modal-map';
import CWModalEdit from '@component/web/cw-modal/cw-modal-edit';
import CWModalSelect from '@component/web/cw-modal/cw-modal-select';
import CWModalPopupSaveComplete from '@component/web/cw-modal/cw-modal-popup-save-complete';
import CWModalPopupSaveError from '@component/web/cw-modal/cw-modal-popup-save-error';
import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import CWModalUpload from '@component/web/cw-modal/cw-modal-upload';
import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';

import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconSettings from '@core/design-system/library/vristo/source/components/Icon/IconSettings';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import IconEye from '@core/design-system/library/vristo/source/components/Icon/IconEye';
import IconType from '@core/design-system/library/vristo/source/components/Icon/IconType';
import IconGraphicEq from '@core/design-system/library/component/icon/IconGraphicEq';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconKey from '@core/design-system/library/component/icon/IconKey';

import Page1 from './component/web/template/Page1';
import Page2 from './component/web/template/Page2';
import Page3 from './component/web/template/Page3';
import Page4 from './component/web/template/Page4';
import Page5 from './component/web/template/Page5';
import { Pagination } from '@mantine/core';
import CwProgress from '@component/web/cw-progress';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWMAccordion from '@component/web/molecule/cw-m-accordion';
import CWTLevelView from '@component/web/template/cw-t-question-view';
import CWImg from '@component/web/atom/wc-a-img';
import CWAccordionManager from '@component/web/molecule/cw-m-accordion-manager';
import CWSwitchTabButton from '@component/web/molecule/cw-m-switch-tab-button';
import CWAvatar from '@component/web/atom/cw-a-avatar';
import CWProgressBar from '@component/web/cw-progress-bar';
import ExampleModalErrorInfos from './component/web/organism/cw-o-modal-error-infos';
import DataTablePreview from './component/web/organism/cw-o-data-table';

const DomainJSX = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const navigate = useNavigate();

  const option = [
    {
      value: 'optio1',
      label: 'option1',
    },
    {
      value: 'optio2',
      label: 'option2',
    },
    {
      value: 'optio3',
      label: 'option3',
    },
    {
      value: 'optio4',
      label: 'option4',
    },
  ];

  const Wizardtabs = [
    {
      id: 1,
      label: '1. ตั้งค่าด่าน',
      icon: <IconSettings duotone={false} />,
      path: '#',
    },
    {
      id: 2,
      label: '2. จัดการคำถาม',
      icon: <IconPencil duotone={false} />,
      path: '#',
    },
    {
      id: 3,
      label: '3. แปลภาษา',
      icon: <IconType className="h-5 w-5" />,
      path: '#',
    },
    {
      id: 4,
      label: '4. สร้างเสียง',
      icon: <IconGraphicEq className="h-7 w-7" />,
      path: '#',
    },
    {
      id: 5,
      label: '5. เผยแพร่',
      icon: <IconEye duotone={false} />,
      path: '#',
    },
  ];

  const totalnumber = 42; // ตัวอย่างจำนวน subtitle
  const title = 'บทเรียนหลัก'; // ชื่อ

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = 20; // จำนวนหน้าทั้งหมด (สมมติ)

  const handlePageChange = (page: number) => {
    console.log('เปลี่ยนไปหน้าที่:', page);
    setCurrentPage(page);
  };

  const handleToggleSwitch = (value: boolean) => {
    console.log('Toggled:', value);
  };

  const handleChangeSwitch = (value: boolean) => {
    console.log('Changed:', value);
  };

  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };
  const modalDownload = useModal();
  const modalUpload = useModal();
  const modalArchive = useModal();
  const modalEdit = useModal();
  const modalSelect = useModal();
  const modalMonster = useModal();
  const modalSuccess = useModal();
  const modalError = useModal();
  const modalDisbanded = useModal();
  const modalResetPassword = useModal();
  const modalQuestionView = useModal();

  const onClick = () => {
    navigate({ to: '/' });
  };

  const [showModalMap, setShowModalMap] = useState(false);
  const [selectedMap, setSelectedMap] = useState('');
  const handleShowModalMap = () => {
    setShowModalMap(true);
  };
  const handleCloseModalMap = () => {
    setShowModalMap(false);
  };
  const handleSelectMap = (mapName: string) => {
    setSelectedMap(mapName);
    setShowModalMap(false);
  };

  const Switchtabs = [
    { id: '1', label: 'Page1', content: <Page1 /> },
    { id: '2', label: 'Page2', content: <Page2 /> },
    { id: '3', label: 'Page3', content: <Page3 /> },
    { id: '4', label: 'Page4', content: <Page4 /> },
    { id: '5', label: 'Page5', content: <Page5 /> },
  ];

  const SwitchTabButtons = [
    { label: 'tab1' },
    { label: 'tab2' },
    { label: 'ตัวเลือกที่3' },
  ];
  const [selectSwitchTabButton, setSelectSwitchTabButton] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <CWWhiteBox>
        <div className="text-xl font-bold">CWWhiteBox</div>
      </CWWhiteBox>

      <CWNeutralBox>
        <div className="text-xl font-bold">CWNeutralBox</div>
      </CWNeutralBox>

      <CWWhiteBox>
        <div className="grid w-full grid-cols-6">
          <div className="col-span-6 border-b-4 py-5">
            <h1 className="mb-5 underline">CWBreadcrumbs</h1>
            <CWBreadcrumbs
              links={[
                { label: 'สำหรับแอดมิน', href: '/', disabled: true },
                { label: 'สังกัดโรงเรียน', href: '/' },
              ]}
            />
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWTitleGroup</h1>
            <CWTitleGroup
              listText={['สังกัดของฉัน', 'มหาวิทยาลัยราชภัฏสวนสุนันทา (มรภ. สวนสุนันทา)']}
            />
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWTitleGroup</h1>
            <CWTitleGroup
              listText={['มรภ. สวนสุนันทา', 'ป.4', 'คณิตศาสตร์', 'คณิตศาสตร์ 1']}
              subtitle={[{ totalNumber: totalnumber, title: title }]}
            />
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWSchoolCard</h1>
            <CWSchoolCard name="โรงเรียนสาธิตมัธยม" code="000000001" subCode="AA109" />
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWTitleBack</h1>
            <CWTitleBack label="แก้ไขสังกัด" href="#" />
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWSelect</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWSelect
                options={option}
                required={false}
                className="w-[200px]"
                onChange={(value) => console.log('Selected value:', value)}
              />
              <CWSelect
                options={option}
                required={false}
                className="w-[200px]"
                title="title"
                onChange={(value) => console.log('Selected value:', value)}
              />
              <CWSelect
                options={option}
                title="title"
                label="label"
                required={false}
                className="w-[200px]"
                onChange={(value) => console.log('Selected value:', value)}
              />

              <CWSelect
                options={option}
                title="title"
                label="label"
                className="w-[200px]"
                onChange={(value) => console.log('Selected value:', value)}
              />
              <CWSelect
                options={option}
                title="title"
                label="label"
                required={true}
                className="w-[200px]"
                onChange={(value) => alert('Selected value:' + value)}
              />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWInput</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWInput
                placeholder={'โปรดกรอก'}
                onChange={(e) => console.log(e.target.value)}
                required={true}
                className="col-span-2"
              />
              <CWInput
                placeholder={'โปรดกรอก'}
                onChange={(e) => console.log(e.target.value)}
                required={true}
                className="col-span-2"
              />
              <CWInput
                placeholder={'โปรดกรอก'}
                onChange={(e) => console.log(e.target.value)}
                required={false}
                title={'ชั้นปี'}
                label={'ชั้นปี'}
                className="col-span-2"
              />
              <CWInput
                placeholder={'โปรดกรอก'}
                onChange={(e) => console.log(e.target.value)}
                required={true}
                title={'ชั้นปี'}
                label={'ชั้นปี'}
                className="col-span-2"
              />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWInputSearch</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWInputSearch placeholder="ค้นหา" />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CAInputDateFlat</h1>
            <div className="grid grid-cols-6 gap-5">
              <div>
                <span>เลือกวันที่ Single mode</span>
                <WCAInputDateFlat
                  onChange={(date) => {
                    console.log('เลือกวันที่ Single mode', date);
                  }}
                />
              </div>
              <div>
                <span>เลือกวันที่ Range mode</span>
                <WCAInputDateFlat
                  options={{
                    mode: 'range',
                    dateFormat: 'd/m/Y',
                  }}
                  onChange={(date) => {
                    console.log('เลือกวันที่ Range mode', date);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWWizardBar</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWWizardBar tabs={Wizardtabs} />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWInputCheckbox</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWInputCheckbox />
              <CWInputCheckbox />
              <CWInputCheckbox />
              <CWInputCheckbox />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWInputRadio</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWInputRadio
                label="Option 1"
                name="group1"
                value="option1"
                onChange={(e) => console.log('Selected:', e.target.value)}
              />
              <CWInputRadio
                label="Option 2"
                name="group2"
                value="option2"
                onChange={(e) => console.log('Selected:', e.target.value)}
              />
              <CWInputRadio />
              <CWInputRadio />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">FileUpload</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <FileUpload />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWInputFile</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWInputFile />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWButtonSwitch</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWButtonSwitch
                initialState={true}
                onToggle={handleToggleSwitch}
                onChange={handleChangeSwitch}
              />

              <CWButtonSwitch
                initialState={false}
                onToggle={handleToggleSwitch}
                onChange={handleChangeSwitch}
              />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWImg</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWImg src="logo192.png" alt="Example Image" />
              <CWImg src="http://error-img.com" />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWAvatar</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWAvatar src="logo192.png" alt="Example Image" />
              <CWAvatar src="http://error-img.com" />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWModal</h1>
            <div className="col-span-6 my-5 flex w-full items-center gap-5">
              <div className="flex gap-x-[10px]">
                <button
                  className="btn btn-primary flex gap-1"
                  onClick={modalDownload.open}
                >
                  {' '}
                  <IconDownload /> Download
                </button>
                <CWModalDownload
                  open={modalDownload.isOpen}
                  onClose={modalDownload.close}
                  onDownload={function (): void {
                    alert(startDate + ' ' + endDate);
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                />
                <button className="btn btn-primary flex gap-1" onClick={modalUpload.open}>
                  {' '}
                  <IconUpload /> Upload
                </button>
                <CWModalUpload open={modalUpload.isOpen} onClose={modalUpload.close} />

                <button className="btn btn-primary flex gap-1" onClick={modalEdit.open}>
                  {' '}
                  <IconPen /> แก้ไขชื่อ
                </button>
                <CWModalEdit open={modalEdit.isOpen} onClose={modalEdit.close} />

                <button
                  className="btn btn-outline-primary flex gap-1"
                  onClick={modalSelect.open}
                >
                  เปลี่ยนเจ้าของ
                </button>
                <CWModalSelect
                  title={'เปลี่ยนเจ้าของ'}
                  label={'เจ้าของบัญชีครอบครัว:'}
                  open={modalSelect.isOpen}
                  onClose={modalSelect.close}
                  onSelect={(owner: string) => {
                    alert(`เจ้าของบัญชีครอบครัวที่เลือก: ${owner}`);
                    modalSelect.close;
                  }}
                  optionsList={[{ id: 1, name: 'ติณณภพ จันทรประการ' }]}
                />

                <button
                  className="btn btn-primary flex gap-1"
                  onClick={modalMonster.open}
                >
                  {' '}
                  เลือกมอนเตอร์
                </button>
                <CWModalCreateMonster
                  open={modalMonster.isOpen}
                  onClose={modalMonster.close}
                />

                <button
                  className="btn btn-success flex gap-1"
                  onClick={modalSuccess.open}
                >
                  บักทึกสำเร็จ
                </button>
                <CWModalPopupSaveComplete
                  open={modalSuccess.isOpen}
                  onClose={modalSuccess.close}
                />
                <button className="btn btn-danger flex gap-1" onClick={modalError.open}>
                  บันทึกไม่สำเร็จ
                </button>
                <CWModalPopupSaveError
                  open={modalError.isOpen}
                  onClose={modalError.close}
                />

                <ExampleModalErrorInfos />
              </div>
            </div>
            <hr />
            <div className="flex gap-x-[10px]">
              <button className="flex gap-1" onClick={modalArchive.open}>
                {' '}
                <IconArchive />
              </button>
              <CWModalArchive open={modalArchive.isOpen} onClose={modalArchive.close} />
              <button className="flex gap-1" onClick={modalDisbanded.open}>
                {' '}
                <IconArchive />
              </button>
              <CWModalDisbanded
                open={modalDisbanded.isOpen}
                onClose={modalDisbanded.close}
              />

              <button className="flex gap-1" onClick={modalResetPassword.open}>
                {' '}
                <IconKey />
              </button>
              <CWModalResetPassword
                open={modalResetPassword.isOpen}
                onClose={modalResetPassword.close}
                onOk={function (password: string): void {
                  alert(password);
                }}
              />
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWModalMap</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <div className="w-full border-b-2 pb-5">
                <h1 className="text-[24px] font-bold">ตั้งค่าพื้นหลังด่าน</h1>
                <p className="my-3">ฉากพื้นหลัง </p>
                <div className="flex w-[400px]">
                  <input
                    type="text"
                    className="form-input"
                    disabled
                    value={selectedMap}
                    required
                  />
                  <button
                    className="btn btn-outline-primary w-40"
                    onClick={handleShowModalMap}
                  >
                    เปลี่ยน
                  </button>
                  <CWModalMap
                    open={showModalMap}
                    onClose={handleCloseModalMap}
                    onSelectMap={handleSelectMap}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWPagination</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </div>
            <h1 className="my-5 underline">Pagination</h1>
            <div className="mt-10">
              <Pagination total={20} />
            </div>
          </div>
          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWButton (fill)</h1>
            <div className="col-span-6 mb-5 flex w-full items-center gap-5">
              <CWButton
                variant={'primary'}
                title={'เพิ่มข้อมูล'}
                onClick={onClick}
                disabled={false}
              />
              <CWButton
                variant={'primary'}
                title={'เพิ่มข้อมูล'}
                onClick={onClick}
                disabled={false}
                icon={<IconPlus />}
              />
              <CWButton
                variant={'primary'}
                title={'เพิ่มข้อมูล'}
                onClick={onClick}
                disabled={true}
              />
              <CWButton
                variant={'primary'}
                title={'กำลังเพิ่มข้อมูล'}
                onClick={onClick}
                loading={true}
              />
              <CWButton
                variant={'primary'}
                title={'ยกเลิก'}
                onClick={onClick}
                outline={true}
              />
              <CWButton
                variant={'dark'}
                title={'ยกเลิก'}
                onClick={onClick}
                outline={true}
              />
              <CWButton
                variant={'secondary'}
                title={'ยกเลิก'}
                onClick={onClick}
                outline={true}
              />
            </div>
            <hr />
            <div className="col-span-6 my-5 flex w-full items-center gap-5">
              <CWButton
                variant={'primary'}
                title={'primary'}
                onClick={onClick}
                disabled={false}
              />
              <CWButton
                variant={'info'}
                title={'info'}
                onClick={onClick}
                disabled={false}
              />
              <CWButton
                variant={'secondary'}
                title={'secondary'}
                onClick={onClick}
                disabled={false}
              />
              <CWButton
                variant={'success'}
                title={'success'}
                onClick={onClick}
                disabled={false}
              />
              <CWButton
                variant={'warning'}
                title={'warning'}
                onClick={onClick}
                disabled={false}
              />
              <CWButton
                variant={'danger'}
                title={'danger'}
                onClick={onClick}
                disabled={false}
              />
              <CWButton
                variant={'dark'}
                title={'dark'}
                onClick={onClick}
                disabled={false}
              />
            </div>
            <hr />
            <div className="col-span-6 my-5 flex w-full items-center gap-5">
              <button className="btn btn-primary">primary</button>
              <button className="btn btn-info">info</button>
              <button className="btn btn-secondary">secondary</button>
              <button className="btn btn-success">success</button>
              <button className="btn btn-warning">warning</button>
              <button className="btn btn-danger">danger</button>
              <button className="btn btn-dark">dark</button>
            </div>
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWButton (outline)</h1>
            <div className="col-span-6 my-5 flex w-full items-center gap-5">
              <CWButton
                variant={'primary'}
                title={'เพิ่มข้อมูล'}
                onClick={onClick}
                disabled={false}
                outline={true}
              />
              <CWButton
                variant={'primary'}
                title={'เพิ่มข้อมูล'}
                onClick={onClick}
                disabled={false}
                icon={<IconPlus />}
                outline={true}
              />
              <CWButton
                variant={'primary'}
                title={'เพิ่มข้อมูล'}
                onClick={onClick}
                disabled={true}
                outline={true}
              />
              <CWButton
                variant={'primary'}
                title={'กำลังเพิ่มข้อมูล'}
                onClick={onClick}
                loading={true}
                outline={true}
              />
            </div>
            <hr />
            <div className="col-span-6 my-5 flex w-full items-center gap-5">
              <CWButton
                variant={'primary'}
                title={'primary'}
                onClick={onClick}
                outline={true}
              />
              <CWButton
                variant={'info'}
                title={'info'}
                onClick={onClick}
                outline={true}
              />
              <CWButton
                variant={'secondary'}
                title={'secondary'}
                onClick={onClick}
                outline={true}
              />
              <CWButton
                variant={'success'}
                title={'success'}
                onClick={onClick}
                outline={true}
              />
              <CWButton
                variant={'warning'}
                title={'warning'}
                onClick={onClick}
                outline={true}
              />
              <CWButton
                variant={'danger'}
                title={'danger'}
                onClick={onClick}
                outline={true}
              />
              <CWButton
                variant={'dark'}
                title={'dark'}
                onClick={onClick}
                outline={true}
              />
            </div>
            <hr />
            <div className="col-span-6 my-5 flex w-full items-center gap-5">
              <button className="btn btn-outline-primary">primary</button>
              <button className="btn btn-outline-info">info</button>
              <button className="btn btn-outline-secondary">secondary</button>
              <button className="btn btn-outline-success">success</button>
              <button className="btn btn-outline-warning">warning</button>
              <button className="btn btn-outline-danger">danger</button>
              <button className="btn btn-outline-dark">dark</button>
            </div>
          </div>
          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWSwitchTabs</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWNeutralBox>
                <CWSwitchTabs tabs={Switchtabs} />
              </CWNeutralBox>
            </div>
          </div>
          <hr />

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWSwitchTabButton</h1>
            <div className="col-span-6 flex w-full items-center gap-5">
              <CWNeutralBox>
                <CWSwitchTabButton
                  tabs={SwitchTabButtons}
                  selectedTab={selectSwitchTabButton}
                  onSelectTab={setSelectSwitchTabButton}
                />
              </CWNeutralBox>
            </div>
          </div>
          <hr />
          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">DataTable</h1>
            <DataTablePreview />
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CwProgress</h1>
            <p>This component enter percent as number</p>
            <CwProgress percent={100} />
            <CwProgress percent={50} />
            <CwProgress percent={0} />
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CwProgressBar</h1>
            <p>This component enter value and total then calculate percentage</p>
            <CWProgressBar score={0} total={1} />
            <CWProgressBar score={50} total={100} />
            <CWProgressBar score={100} total={100} />
          </div>

          <div className="col-span-6 border-b-4 py-5">
            <h1 className="my-5 underline">CWMAccordion</h1>
            <div className="grid grid-cols-3 gap-4">
              <CWMAccordion title="Title 2">
                <div>Content 1</div>
                <div>Content 1</div>
                <div>Content 1</div>
                <div>Content 1</div>
                <div>Content 1</div>
              </CWMAccordion>
              <CWMAccordion title={'Title 1'}>
                <div>Content 1</div>
                <CWMAccordion title={'Title 2'} className="pl-4 pt-2">
                  <div>Content 2</div>
                  <CWMAccordion title={'Title 3'} className="pl-4 pt-2">
                    <div>Content 3</div>
                  </CWMAccordion>
                </CWMAccordion>
              </CWMAccordion>
              <CWMAccordion
                title={
                  <div className="flex items-center gap-2 pl-4 font-bold">
                    <IconPen />
                    Title 3
                  </div>
                }
                expandAll
              >
                <div>Content 3</div>
                <div>Content 3</div>
                <div>Content 3</div>
              </CWMAccordion>
            </div>
          </div>

          <div className="col-span-6 flex flex-col gap-4 border-b-4 py-5">
            <h1 className="my-5 underline">CWAccordionManager</h1>
            <div className="0 flex gap-x-[10px]">
              <CWAccordionManager
                accordionLists={[
                  { title: 'accordion #1', render: 'Content' },
                  {
                    title: 'accordion #2',
                    render: <DataTablePreview />,
                  },
                  {
                    className: 'bg-blue-50',
                    title: 'accordion # Custom className',
                    render: 'Custom ClassName',
                  },
                ]}
              />
            </div>
          </div>

          <div className="col-span-6 flex flex-col gap-4 border-b-4 py-5">
            <h1 className="my-5 underline">CWT Modal Question view</h1>
            <div className="flex gap-x-[10px]">
              <button
                className="btn btn-primary flex gap-1"
                onClick={modalQuestionView.open}
              >
                คำถาม Question view
              </button>
              <CWModalQuestionView
                open={modalQuestionView.isOpen}
                onClose={modalQuestionView.close}
                levelId={2}
                levelPlayLogId={1}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-4">
                <div className="text-lg font-bold">คำถาม</div>
                <CWTLevelView levelId={2} />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-lg font-bold">คำถาม</div>
                <CWTLevelView levelId={2} levelPlayLogId={1} />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-lg font-bold">คำถาม</div>
                <CWTLevelView levelId={3} expandAll />
              </div>
            </div>
          </div>
        </div>
      </CWWhiteBox>
    </div>
  );
};

interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

export default DomainJSX;
