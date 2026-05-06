import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import CWSchoolCard from '@component/web/cw-school-card';
import CWTitleBack from '@component/web/cw-title-back';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconLink from '@core/design-system/library/component/icon/IconLink';
import CWButtonSwitch from '@component/web/cw-button-switch';
import IconSettings from '@core/design-system/library/component/icon/IconSettings';
import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import CWButton from '@component/web/cw-button';
import AnimateHeight from 'react-animate-height';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import IconArrowUp from '@core/design-system/library/component/icon/IconArrowUp';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import { Link } from '@tanstack/react-router';
import CWTextArea from '@component/web/cw-textarea';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

const DomainJSX = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [showModalSetScore, setShowModalSetScore] = useState('none');
  const [scoreMode, setScoreMode] = useState(1);
  const [advanceMode, setAdvanceMode] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [replaceMode, setReplaceMode] = useState(false);

  useEffect(() => {
    if (!advanceMode && showModalSetScore !== 'none') {
      setShowModalSetScore('none');
    }
  }, [showModalSetScore]);

  const [showModalAddNote, setShowModalAddNote] = useState(false);

  return (
    <LayoutDefault>
      <CWBreadcrumbs
        links={[
          {
            href: '#',
            label: 'โรงเรียนสาธิตมัธยม',
          },
          {
            href: '#',
            label: 'การเรียนการสอน',
          },
          {
            href: '#',
            label: 'ระบบตัดเกรด (ปพ.)',
          },
          {
            href: '#',
            label: 'ใบตัดเกรดของฉัน',
          },
          {
            href: '#',
            label: 'กรอกข้อมูลใบตัดเกรด',
          },
        ]}
      />

      <CWSchoolCard
        code="0000001"
        name="โรงเรียนเกษม"
        subCode="xxx"
        image="/public/logo192.png"
        className="mb-5"
      />

      <CWTitleBack href="#" label="กรอกข้อมูลใบตัดเกรด" />

      {/* breadcrumbs */}
      <div className="my-5 flex justify-between bg-[#F5F5F5] px-2 py-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">คณิตศาสตร์ / ป. 4 / 1</span>
            <button className="flex gap-2 rounded border border-gray-400 bg-white p-1">
              <IconLink />
              เชื่อมต่อกับระบบ Clever
            </button>
          </div>
          <span>รหัสใบประเมิน: 00000000001 </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-full items-center gap-2 rounded border border-primary bg-white p-2 text-primary">
            <IconSettings /> ตั้งค่าตัวชี้วัด
          </button>
          <div className="flex items-center gap-2 rounded border border-primary bg-white p-2">
            <CWButtonSwitch
              onToggle={() => setAdvanceMode(!advanceMode)}
              initialState={advanceMode}
            />
            <div className="flex flex-col">
              <span>Advance mode:</span>
              <span>เปิดหน้าต่างแสดงรายละเอียดเพื่อบันทึกคะแนนแต่ละช่อง</span>
            </div>
          </div>
        </div>
      </div>

      {/* ตาราง */}
      <div className={`p-5 ${advanceMode ? 'bg-[#FFA62933]' : 'bg-white'}`}>
        <table className="th-fixed w-full table-fixed border-collapse border bg-white">
          <thead>
            <tr>
              <th rowSpan={3} className="w-[100px] border text-center">
                เลขที่
              </th>
              <th rowSpan={3} className="w-[200px] border text-center">
                ชื่อสกุล
              </th>
              <th colSpan={13} className="border">
                คะแนนผลการเรียน
              </th>
              <th colSpan={10} className="border">
                คะแนนผลการเรียน
              </th>
              <th rowSpan={3} className="w-[100px] border">
                ร้อยละ
              </th>
              <th rowSpan={3} className="w-[100px] border">
                ลำดับที่คะแนนรวม
              </th>
            </tr>

            <tr>
              <th
                className="th-rotate border"
                onClick={() => setShowModalSetScore('head')}
              >
                ชื่อตัวชี้วัด
              </th>
              <th
                className="th-rotate border"
                onClick={() => setShowModalSetScore('head')}
              >
                ชื่อตัวชี้วัด
              </th>
              <th
                className="th-rotate border"
                onClick={() => setShowModalSetScore('head')}
              >
                ชื่อตัวชี้วัด
              </th>
              <th
                className="th-rotate border"
                onClick={() => setShowModalSetScore('head')}
              >
                ชื่อตัวชี้วัด
              </th>
              <th
                className="th-rotate border"
                onClick={() => setShowModalSetScore('head')}
              >
                ชื่อตัวชี้วัด
              </th>
              <th
                className="th-rotate border"
                onClick={() => setShowModalSetScore('head')}
              >
                ชื่อตัวชี้วัด
              </th>
              <th
                className="th-rotate border"
                onClick={() => setShowModalSetScore('head')}
              >
                ชื่อตัวชี้วัด
              </th>
              <th
                className="th-rotate border"
                onClick={() => setShowModalSetScore('head')}
              >
                ชื่อตัวชี้วัด
              </th>
              <th
                className="th-rotate border"
                onClick={() => setShowModalSetScore('head')}
              >
                ชื่อตัวชี้วัด
              </th>
              <th
                className="th-rotate border"
                onClick={() => setShowModalSetScore('head')}
              >
                ชื่อตัวชี้วัด
              </th>
              <th className="th-rotate border"></th>
              <th className="th-rotate border"></th>
              <th className="th-rotate border"></th>
              <th className="th-rotate border"></th>
              <th className="th-rotate border"></th>
              <th className="th-rotate border"></th>
              <th className="th-rotate border"></th>
              <th className="th-rotate border"></th>
              <th className="th-rotate border"></th>
              <th className="th-rotate border"></th>
              <th className="border" colSpan={3}>
                รวม
              </th>
            </tr>

            <tr>
              <th className="border text-blue-600">##</th>
              <th className="border text-blue-600">##</th>
              <th className="border text-blue-600">##</th>
              <th className="border text-blue-600">##</th>
              <th className="border text-blue-600">##</th>
              <th className="border text-blue-600">##</th>
              <th className="border text-blue-600">##</th>
              <th className="border text-blue-600">##</th>
              <th className="border text-blue-600">##</th>
              <th className="border text-blue-600">##</th>
              <th className="border"></th>
              <th className="border"></th>
              <th className="border"></th>
              <th className="border"></th>
              <th className="border"></th>
              <th className="border"></th>
              <th className="border"></th>
              <th className="border"></th>
              <th className="border"></th>
              <th className="border"></th>
              <th className="border" colSpan={3}>
                100
              </th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3].map((item, index) => (
              <tr key={index}>
                <td className="border">{index + 1}</td>
                <td className="border">นาย ชื่อ-สกุล</td>
                <td
                  onClick={() => setShowModalSetScore('person')}
                  className="td-fixed cursor-pointer border"
                >
                  1
                </td>
                <td
                  onClick={() => setShowModalSetScore('person')}
                  className="td-fixed cursor-pointer border"
                >
                  1
                </td>
                <td
                  onClick={() => setShowModalSetScore('person')}
                  className="td-fixed cursor-pointer border"
                >
                  1
                </td>
                <td
                  onClick={() => setShowModalSetScore('person')}
                  className="td-fixed cursor-pointer border"
                >
                  1
                </td>
                <td
                  onClick={() => setShowModalSetScore('person')}
                  className="td-fixed cursor-pointer border"
                >
                  1
                </td>
                <td
                  onClick={() => setShowModalSetScore('person')}
                  className="td-fixed cursor-pointer border"
                >
                  1
                </td>
                <td
                  onClick={() => setShowModalSetScore('person')}
                  className="td-fixed cursor-pointer border"
                >
                  1
                </td>
                <td
                  onClick={() => setShowModalSetScore('person')}
                  className="td-fixed cursor-pointer border"
                >
                  1
                </td>
                <td
                  onClick={() => setShowModalSetScore('person')}
                  className="td-fixed cursor-pointer border"
                >
                  1
                </td>
                <td
                  onClick={() => setShowModalSetScore('person')}
                  className="td-fixed cursor-pointer border"
                >
                  1
                </td>

                <td className="td-fixed border"></td>
                <td className="td-fixed border"></td>
                <td className="td-fixed border"></td>
                <td className="td-fixed border"></td>
                <td className="td-fixed border"></td>
                <td className="td-fixed border"></td>
                <td className="td-fixed border"></td>
                <td className="td-fixed border"></td>
                <td className="td-fixed border"></td>
                <td className="td-fixed border"></td>
                <td className="td-fixed border" colSpan={3}>
                  30
                </td>
                <td className="td-fixed border">9.0</td>
                <td className="td-fixed border">2</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ใต้ตาราง */}
      <div>
        <div className="my-5 flex justify-between">
          <div className="flex items-center gap-2">
            <CWButton title="บันทึก" />
            <CWButton outline title="รีเซทคะแนน" />
            <CWButton outline title="ยกเลิก" />

            <span>แก้ไขล่าสุด: 20 ก.พ 2565 24:24, Admin</span>
          </div>
          <button className="btn btn-primary">
            ส่งข้อมูล <IconCaretDown className="-rotate-90" />
          </button>
        </div>

        <div className="my-5 flex justify-between">
          <h3 className="text-xl font-bold">หมายเหตุ</h3>
          <button onClick={() => setShowModalAddNote(true)} className="btn btn-primary">
            เพิ่มโน้ต
          </button>
        </div>
        {/* card comment */}
        {[1, 2].map((item, index) => (
          <div key={index} className="my-5 w-full rounded bg-white p-5 shadow">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <img
                  alt="school_image"
                  src="/public/logo192.png"
                  className="aspect-square h-8 w-8 rounded-full bg-blue-400"
                />
                <div>
                  <h4 className="mb-2 font-bold">Teacher A</h4>
                  <p>วว/ดด/ปปปป 00:00</p>
                </div>
              </div>

              <button>
                <IconTrash className="text-red-500" />
              </button>
            </div>
            <p className="my-3">
              Lorem ipsum dolor sit amet consectetur. Quis volutpat viverra etiam
              ullamcorper at. Non pretium pretium libero pellentesque ultricies. Pulvinar
              nec diam semper diam sit tincidunt laoreet sed leo. Leo iaculis ultrices ut
              interdum. Leo fames at.
            </p>
          </div>
        ))}
      </div>

      <CWModalCustom
        open={showModalSetScore !== 'none' && advanceMode}
        title="ตั้งค่าเกณฑ์ประเมินคะแนน"
        cancelButtonName="ยกเลิก"
        buttonName="บันทึก"
        size="large"
        onClose={() => {
          setShowModalSetScore('none');
        }}
        onOk={() => {
          setShowModalSetScore('none');
        }}
      >
        <div className="flex flex-col rounded-md border-2 border-primary p-3 text-sm">
          <div className="flex justify-between rounded-t bg-gray-200 p-2">
            <div className="flex flex-col">
              <span>สาระการเรียนรู้: ชื่อสาระการเรียนรู้</span>
              <span>ชื่อตัวชี้วัด: xxxxx</span>
            </div>
          </div>
          <div className="mt-5 flex w-full items-center justify-between">
            <span>หลักการประเมินคะแนน</span>
            <div className="flex">
              <button
                onClick={() => setScoreMode(1)}
                className={`rounded-l border p-2 ${scoreMode === 1 && 'bg-primary text-white'}`}
              >
                ใช้เกณฑ์ของนักวิชาการ
              </button>
              <button
                onClick={() => setScoreMode(2)}
                className={`border p-2 ${scoreMode === 2 && 'bg-orange-600 text-white'}`}
              >
                ใช้เกณฑ์ของครู
              </button>
              <button
                onClick={() => setScoreMode(3)}
                className={`rounded-r border p-2 ${scoreMode === 3 && 'bg-gray-700 text-white'}`}
              >
                กรอกคะแนนไม่ใช้เกณฑ์
              </button>
            </div>
          </div>
        </div>

        {showModalSetScore === 'person' &&
          (scoreMode !== 3 ? (
            <div
              className={`rounded border-4 p-3 ${replaceMode ? 'bg-orange-300' : 'bg-gray-100'}`}
            >
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <CWInputCheckbox
                      checked={replaceMode}
                      onChange={() => setShowModalConfirm(true)}
                    />
                    <span>กรอกคะแนนทับ</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CWInput
                      className="text-right"
                      placeholder="กรอกตัวเลข"
                      type="number"
                    />{' '}
                    / 100
                  </div>
                </div>
                <span className="text-xs text-red-500">
                  *เลือกหากต้องการกรอกคะแนนเอง โดยไม่ใช้ระบบบคำนวนคะแนน
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded border-2 bg-white p-3">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span>กรอกคะแนนไม่ใช้เกณฑ์</span>
                </div>

                <div className="flex items-center gap-2">
                  <CWInput
                    className="text-right"
                    placeholder="กรอกตัวเลข"
                    type="number"
                  />{' '}
                  / 100
                </div>
              </div>
            </div>
          ))}

        {scoreMode !== 3 && !replaceMode && (
          <div className="max-h-[200px] overflow-y-scroll">
            <div className="flex items-center justify-between border-b-2 py-5">
              <div className="flex flex-col">
                <h3>เกณฑ์การประเมิน</h3>
                <p>คะแนนจะถูกคำนวนจากหัวข้อด้านล่าง ตามน้ำหนักที่กำหนด</p>
              </div>

              <div className="flex gap-2">
                <CWButton outline={true} title="เลือกทั้งหมด" />
                <CWButton outline={true} title="ไม่เลือกทั้งหมด" />
              </div>
            </div>

            <div className="border">
              <div className={`flex h-fit w-full items-center gap-2 px-4 py-3`}>
                <button>{'1' !== '1' ? <IconArrowDown /> : <IconArrowUp />}</button>

                <CWInputCheckbox />

                <span>ด่านประเมินก่อนเรียน</span>
              </div>
              <div>
                <AnimateHeight
                  className="px-5"
                  duration={300}
                  height={'1' === '1' ? 'auto' : 0}
                >
                  <hr />

                  <div className="py-5">
                    <p>เลือกบทเรียนที่นำมาคำนวนคะแนน</p>
                    <hr />
                    <div className="grid grid-cols-2 gap-2 py-10">
                      <CWSelect
                        required
                        title="บทเรียนหลัก"
                        label="บทเรียนหลัก"
                        options={[]}
                      />

                      <CWSelect
                        required
                        label="บทเรียนย่อย"
                        title="บทเรียนย่อย"
                        options={[]}
                      />
                    </div>
                  </div>

                  {/* ไส้ข้างใน */}
                  <div className="mb-5 border">
                    <div
                      className={`flex h-fit w-full items-center justify-between bg-gray-300 px-4`}
                    >
                      <div className="flex items-center">
                        <button>
                          {'1' !== '1' ? <IconArrowDown /> : <IconArrowUp />}
                        </button>

                        <span>จำนวนนับและสมบัติของจำนวนนับ 1</span>
                      </div>

                      <div>
                        <span>2 ด่าน</span>
                      </div>
                    </div>
                    <div>
                      <AnimateHeight duration={300} height={'1' === '1' ? 'auto' : 0}>
                        <p className="m-2 bg-green-300 px-5 text-xs">ก่อนเรียน</p>
                        <div className="flex justify-between px-5">
                          <div className="w-full">
                            <Link
                              to="#"
                              className="text-blue-500 underline decoration-dotted before:mr-2 before:content-['•']"
                            >
                              1
                            </Link>
                          </div>

                          <div className="w-full">
                            <Link
                              to="#"
                              className="text-blue-500 underline decoration-dotted before:mr-2 before:content-['•']"
                            >
                              2
                            </Link>
                          </div>
                        </div>
                      </AnimateHeight>
                    </div>
                  </div>
                </AnimateHeight>
              </div>
              {/* จบ ไส้ข้างใน */}
            </div>

            <div className="border">
              <div className={`flex h-fit w-full items-center gap-2 px-4 py-3`}>
                <button>{'1' !== '1' ? <IconArrowDown /> : <IconArrowUp />}</button>

                <CWInputCheckbox />

                <span>จิตพิสัย</span>
              </div>
              <div>
                <AnimateHeight
                  className="px-5 py-2"
                  duration={300}
                  height={'1' === '1' ? 'auto' : 0}
                >
                  <hr />

                  <div className="flex items-center justify-between">
                    <span>พฤติกรรม: ส่งการบ้าน เกิน 70%</span>
                    <div className="flex items-center gap-2 py-2">
                      <span>
                        <span className="text-red-500">*</span> น้ำหนัก
                      </span>
                      <input className="rounded-md border p-2" />
                    </div>
                  </div>

                  <hr />

                  <div className="flex items-center justify-between">
                    <span>พฤติกรรม: การล็อกอิน เกิน 70%</span>
                    <div className="flex items-center gap-2 py-2">
                      <span>
                        <span className="text-red-500">*</span> น้ำหนัก
                      </span>
                      <input className="rounded-md border p-2" />
                    </div>
                  </div>

                  <hr />
                </AnimateHeight>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between bg-gray-200 p-2">
          <span>คะแนนรวม:</span>
          <span>50/100</span>
        </div>
      </CWModalCustom>

      <CWModalCustom
        open={showModalAddNote}
        onClose={() => setShowModalAddNote(false)}
        onOk={() => setShowModalAddNote(false)}
        title="เพิ่มโน้ต"
        buttonName="เพิ่มโน้ต"
        cancelButtonName="ยกเลิก"
      >
        <CWTextArea></CWTextArea>
      </CWModalCustom>

      <CWModalCustom
        open={showModalConfirm}
        onClose={() => {
          setShowModalConfirm(false);
          setReplaceMode(false);
        }}
        onOk={() => {
          setShowModalConfirm(false);
          setReplaceMode(true);
        }}
        title="ยืนยันกรอกคะแนนด้วยตนเอง"
        buttonName="ยืนยัน"
        cancelButtonName="ยกเลิก"
      >
        <p>คุณยืนยันที่จะใช้คะแนนจากการกรอกแทนการคำนวนอัตโนมัติ ใช่หรือไม่</p>
      </CWModalCustom>
    </LayoutDefault>
  );
};

export default DomainJSX;
