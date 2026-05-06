import CWButton from '@component/web/cw-button';
import CWInput from '@component/web/cw-input';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import Modal, { ModalProps } from '@component/web/cw-modal/Modal';
import CWNeutralBox from '@component/web/cw-neutral-box';
import CWSelect from '@component/web/cw-select';
import CWWhiteBox from '@component/web/cw-white-box';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import { useState } from 'react';

interface ContentModalProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'edit' | 'view';
  onMode: (mode: any) => void;
}

const SettingModal = ({
  open,
  onClose,
  children,
  onOk,
  mode,
  onMode,
  ...rest
}: ContentModalProps) => {
  const [items, setItems] = useState([...Array(3).keys()].map((i) => i));
  const [items2, setItems2] = useState([...Array(3).keys()].map((i) => i));
  const [criteria, setCriteria] = useState(1);
  return (
    <Modal
      className="h-auto w-[1200px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={'ตั้งค่าการประเมินคะแนน'}
      {...rest}
    >
      <div className="w-full">
        <CWWhiteBox className="mb-5 border p-0 shadow-md">
          <div className="grid grid-cols-2 bg-neutral-100 p-3">
            <div className="grid grid-rows-2">
              <p>สาระการเรียนรู้:</p>
              <p>ชื่อตัวชี้วัด:</p>
            </div>
            <div className="grid grid-rows-2">
              <p>ชื่อสาระการเรียนรู้</p>
              <p>xxxxx</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3">
            <h1 className="text-[18px] font-bold">หลักการประเมินคะแนน</h1>
            <div className="row flex">
              <button
                className={`${criteria == 1 && 'bg-primary font-bold text-white'} rounded-md rounded-r-none border px-4 py-2 text-center text-sm transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                type="button"
                onClick={() => {
                  setCriteria(1);
                  onMode('view');
                }}
              >
                ใช้เกณฑ์ของนักวิชาการ
              </button>
              <button
                className={`${criteria == 2 && 'bg-warning font-bold text-white'} rounded-none border border-l border-r px-4 py-2 text-center text-sm transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                type="button"
                onClick={() => {
                  setCriteria(2);
                  onMode('edit');
                }}
              >
                ใช้เกณฑ์ของครู
              </button>
              <button
                className={`${criteria == 3 && 'bg-neutral-500 font-bold text-white'} rounded-md rounded-l-none border px-4 py-2 text-center text-sm transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                type="button"
                onClick={() => setCriteria(3)}
              >
                กรอกคะแนนไม่ใช่เกณฑ์
              </button>
            </div>
          </div>
        </CWWhiteBox>
        {criteria != 3 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-[20px] font-bold">
                เกณฑ์การประเมิน
                <span className="text-base font-normal">
                  <br />
                  คะแนนจะถูกคำนวนจากหัวข้อด้านล่าง ตามน้ำหนักที่กำหนด
                </span>
              </h1>
              <div className="flex gap-4">
                <CWButton
                  title="เลือกใช้ทั้งหมด"
                  disabled={mode == 'view'}
                  outline={true}
                />
                <CWButton
                  title="ไม่เลือกทั้งหมด"
                  disabled={mode == 'view'}
                  outline={true}
                />
              </div>
            </div>
            <hr />
            <div className="my-5 grid grid-cols-2 gap-5">
              <CWSelect label="บทเรียนหลัก" disabled={mode == 'view'} required={true} />
              <CWSelect label="บทเรียนย่อย" disabled={mode == 'view'} required={true} />
            </div>
            <ul className="mx-auto mb-5 w-full divide-y rounded border bg-white shadow-md">
              <li>
                <details className="group/main px-4">
                  <summary className="flex justify-between gap-3 px-4 py-2 font-medium marker:content-none hover:cursor-pointer">
                    <div className="flex items-center">
                      <IconArrowDown className="mr-2 transition group-open/main:rotate-180" />
                      <CWInputCheckbox
                        className="text-[18px] font-bold"
                        label="ด่านประเมินก่อนเรียน"
                        name="pre-evaluate"
                        value="pre-evaluate"
                        disabled={mode == 'view'}
                        onChange={(e) => console.log('Selected:', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center">
                      <h1 className="mr-4">
                        <span className="text-danger">*</span>Weight
                      </h1>
                      <CWInput
                        placeholder={'30'}
                        required={true}
                        disabled={mode == 'view'}
                        onChange={(e) => console.log(e)}
                      />
                    </div>
                  </summary>

                  <article className="border-t-2 px-4 py-4">
                    <h1 className="text-[18px] font-bold">
                      เลือกบทเรียนที่นำมาคำนวณคะแนน
                    </h1>
                    <hr className="mb-5" />
                    {items.map((item, index) => (
                      <div className="w-full">
                        <div className="flex justify-between">
                          <p className="my-4 font-bold">บทเรียนที่ {index + 1}</p>
                          {mode == 'edit' && (
                            <button
                              onClick={() =>
                                setItems([...items.filter((el, i) => i != index)])
                              }
                            >
                              <IconTrash />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                        </div>
                        <ul>
                          <li>
                            <details className="group/sub mt-3">
                              <summary className="flex justify-between gap-3 bg-stone-200 px-2 py-2 font-medium marker:content-none hover:cursor-pointer">
                                <div className="flex items-center">
                                  <IconArrowDown className="mr-2 transition group-open/sub:rotate-180" />
                                  <p className="font-bold">
                                    จำนวนนับและสมบัติของจำนวนนับ 1
                                  </p>
                                </div>
                                <p>{items.length} ด่าน</p>
                              </summary>

                              <article className="border-t-2 py-4">
                                <p className="mb-5 w-full bg-green-200 px-2">ก่อนเรียน</p>
                                <div className="grid w-full grid-cols-5">
                                  <CWInputCheckbox
                                    value={1}
                                    label="1"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={2}
                                    label="2"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={3}
                                    label="3"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={4}
                                    label="4"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={5}
                                    label="5"
                                    disabled={mode == 'view'}
                                  />
                                </div>
                              </article>
                            </details>
                          </li>
                        </ul>
                      </div>
                    ))}
                    <hr className="my-5" />
                    {mode == 'edit' && (
                      <CWButton
                        title="เพิ่มบทเรียน"
                        variant="primary"
                        outline={true}
                        onClick={() => setItems([...items, items.length])}
                      />
                    )}
                  </article>
                </details>
              </li>
            </ul>

            <ul className="mx-auto mb-5 w-full divide-y rounded border bg-white shadow-md">
              <li>
                <details className="group/main px-4">
                  <summary className="flex justify-between gap-3 px-4 py-2 font-medium marker:content-none hover:cursor-pointer">
                    <div className="flex items-center">
                      <IconArrowDown className="mr-2 transition group-open/main:rotate-180" />
                      <CWInputCheckbox
                        className="text-[18px] font-bold"
                        label="ด่านง่าย"
                        name="easy"
                        value="easy"
                        disabled={mode == 'view'}
                        onChange={(e) => console.log('Selected:', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center">
                      <h1 className="mr-4">
                        <span className="text-danger">*</span>Weight
                      </h1>
                      <CWInput
                        placeholder={'30'}
                        required={true}
                        disabled={mode == 'view'}
                        onChange={(e) => console.log(e)}
                      />
                    </div>
                  </summary>

                  <article className="border-t-2 px-4 py-4">
                    <h1 className="text-[18px] font-bold">
                      เลือกบทเรียนที่นำมาคำนวณคะแนน
                    </h1>
                    <hr className="mb-5" />
                    {items.map((item, index) => (
                      <div className="w-full">
                        <div className="flex justify-between">
                          <p className="my-4 font-bold">บทเรียนที่ {index + 1}</p>
                          {mode == 'edit' && (
                            <button
                              onClick={() =>
                                setItems([...items.filter((el, i) => i != index)])
                              }
                            >
                              <IconTrash />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                        </div>
                        <ul>
                          <li>
                            <details className="group/sub mt-3">
                              <summary className="flex justify-between gap-3 bg-stone-200 px-2 py-2 font-medium marker:content-none hover:cursor-pointer">
                                <div className="flex items-center">
                                  <IconArrowDown className="mr-2 transition group-open/sub:rotate-180" />
                                  <p className="font-bold">
                                    จำนวนนับและสมบัติของจำนวนนับ 1
                                  </p>
                                </div>
                                <p>{items.length} ด่าน</p>
                              </summary>

                              <article className="border-t-2 py-4">
                                <p className="mb-5 w-full bg-green-200 px-2">ด่านง่าย</p>
                                <div className="grid w-full grid-cols-5">
                                  <CWInputCheckbox
                                    value={1}
                                    label="1"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={2}
                                    label="2"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={3}
                                    label="3"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={4}
                                    label="4"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={5}
                                    label="5"
                                    disabled={mode == 'view'}
                                  />
                                </div>
                              </article>
                            </details>
                          </li>
                        </ul>
                      </div>
                    ))}
                    <hr className="my-5" />
                    {mode == 'edit' && (
                      <CWButton
                        title="เพิ่มบทเรียน"
                        variant="primary"
                        outline={true}
                        onClick={() => setItems([...items, items.length])}
                      />
                    )}
                  </article>
                </details>
              </li>
            </ul>

            <ul className="mx-auto mb-5 w-full divide-y rounded border bg-white shadow-md">
              <li>
                <details className="group/main px-4">
                  <summary className="flex justify-between gap-3 px-4 py-2 font-medium marker:content-none hover:cursor-pointer">
                    <div className="flex items-center">
                      <IconArrowDown className="mr-2 transition group-open/main:rotate-180" />
                      <CWInputCheckbox
                        className="text-[18px] font-bold"
                        label="ด่านปานกลาง"
                        name="normal"
                        value="normal"
                        disabled={mode == 'view'}
                        onChange={(e) => console.log('Selected:', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center">
                      <h1 className="mr-4">
                        <span className="text-danger">*</span>Weight
                      </h1>
                      <CWInput
                        placeholder={'30'}
                        required={true}
                        disabled={mode == 'view'}
                        onChange={(e) => console.log(e)}
                      />
                    </div>
                  </summary>

                  <article className="border-t-2 px-4 py-4">
                    <h1 className="text-[18px] font-bold">
                      เลือกบทเรียนที่นำมาคำนวณคะแนน
                    </h1>
                    <hr className="mb-5" />
                    {items.map((item, index) => (
                      <div className="w-full">
                        <div className="flex justify-between">
                          <p className="my-4 font-bold">บทเรียนที่ {index + 1}</p>
                          {mode == 'edit' && (
                            <button
                              onClick={() =>
                                setItems([...items.filter((el, i) => i != index)])
                              }
                            >
                              <IconTrash />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                        </div>
                        <ul>
                          <li>
                            <details className="group/sub mt-3">
                              <summary className="flex justify-between gap-3 bg-stone-200 px-2 py-2 font-medium marker:content-none hover:cursor-pointer">
                                <div className="flex items-center">
                                  <IconArrowDown className="mr-2 transition group-open/sub:rotate-180" />
                                  <p className="font-bold">
                                    จำนวนนับและสมบัติของจำนวนนับ 1
                                  </p>
                                </div>
                                <p>{items.length} ด่าน</p>
                              </summary>

                              <article className="border-t-2 py-4">
                                <p className="mb-5 w-full bg-green-200 px-2">
                                  ด่านปานกลาง
                                </p>
                                <div className="grid w-full grid-cols-5">
                                  <CWInputCheckbox
                                    value={1}
                                    label="1"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={2}
                                    label="2"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={3}
                                    label="3"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={4}
                                    label="4"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={5}
                                    label="5"
                                    disabled={mode == 'view'}
                                  />
                                </div>
                              </article>
                            </details>
                          </li>
                        </ul>
                      </div>
                    ))}
                    <hr className="my-5" />
                    {mode == 'edit' && (
                      <CWButton
                        title="เพิ่มบทเรียน"
                        variant="primary"
                        outline={true}
                        onClick={() => setItems([...items, items.length])}
                      />
                    )}
                  </article>
                </details>
              </li>
            </ul>

            <ul className="mx-auto mb-5 w-full divide-y rounded border bg-white shadow-md">
              <li>
                <details className="group/main px-4">
                  <summary className="flex justify-between gap-3 px-4 py-2 font-medium marker:content-none hover:cursor-pointer">
                    <div className="flex items-center">
                      <IconArrowDown className="mr-2 transition group-open/main:rotate-180" />
                      <CWInputCheckbox
                        className="text-[18px] font-bold"
                        label="ด่านยาก"
                        name="hard"
                        value="hard"
                        disabled={mode == 'view'}
                        onChange={(e) => console.log('Selected:', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center">
                      <h1 className="mr-4">
                        <span className="text-danger">*</span>Weight
                      </h1>
                      <CWInput
                        placeholder={'30'}
                        required={true}
                        disabled={mode == 'view'}
                        onChange={(e) => console.log(e)}
                      />
                    </div>
                  </summary>

                  <article className="border-t-2 px-4 py-4">
                    <h1 className="text-[18px] font-bold">
                      เลือกบทเรียนที่นำมาคำนวณคะแนน
                    </h1>
                    <hr className="mb-5" />
                    {items.map((item, index) => (
                      <div className="w-full">
                        <div className="flex justify-between">
                          <p className="my-4 font-bold">บทเรียนที่ {index + 1}</p>
                          {mode == 'edit' && (
                            <button
                              onClick={() =>
                                setItems([...items.filter((el, i) => i != index)])
                              }
                            >
                              <IconTrash />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                        </div>
                        <ul>
                          <li>
                            <details className="group/sub mt-3">
                              <summary className="flex justify-between gap-3 bg-stone-200 px-2 py-2 font-medium marker:content-none hover:cursor-pointer">
                                <div className="flex items-center">
                                  <IconArrowDown className="mr-2 transition group-open/sub:rotate-180" />
                                  <p className="font-bold">
                                    จำนวนนับและสมบัติของจำนวนนับ 1
                                  </p>
                                </div>
                                <p>{items.length} ด่าน</p>
                              </summary>

                              <article className="border-t-2 py-4">
                                <p className="mb-5 w-full bg-green-200 px-2">ด่านยาก</p>
                                <div className="grid w-full grid-cols-5">
                                  <CWInputCheckbox
                                    value={1}
                                    label="1"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={2}
                                    label="2"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={3}
                                    label="3"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={4}
                                    label="4"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={5}
                                    label="5"
                                    disabled={mode == 'view'}
                                  />
                                </div>
                              </article>
                            </details>
                          </li>
                        </ul>
                      </div>
                    ))}
                    <hr className="my-5" />
                    {mode == 'edit' && (
                      <CWButton
                        title="เพิ่มบทเรียน"
                        variant="primary"
                        outline={true}
                        onClick={() => setItems([...items, items.length])}
                      />
                    )}
                  </article>
                </details>
              </li>
            </ul>

            <ul className="mx-auto mb-5 w-full divide-y rounded border bg-white shadow-md">
              <li>
                <details className="group/main px-4">
                  <summary className="flex justify-between gap-3 px-4 py-2 font-medium marker:content-none hover:cursor-pointer">
                    <div className="flex items-center">
                      <IconArrowDown className="mr-2 transition group-open/main:rotate-180" />
                      <CWInputCheckbox
                        className="text-[18px] font-bold"
                        label="ด่านบอส"
                        name="boss"
                        value="boss"
                        disabled={mode == 'view'}
                        onChange={(e) => console.log('Selected:', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center">
                      <h1 className="mr-4">
                        <span className="text-danger">*</span>Weight
                      </h1>
                      <CWInput
                        placeholder={'30'}
                        required={true}
                        disabled={mode == 'view'}
                        onChange={(e) => console.log(e)}
                      />
                    </div>
                  </summary>

                  <article className="border-t-2 px-4 py-4">
                    <h1 className="text-[18px] font-bold">
                      เลือกบทเรียนที่นำมาคำนวณคะแนน
                    </h1>
                    <hr className="mb-5" />
                    {items.map((item, index) => (
                      <div className="w-full">
                        <div className="flex justify-between">
                          <p className="my-4 font-bold">บทเรียนที่ {index + 1}</p>
                          {mode == 'edit' && (
                            <button
                              onClick={() =>
                                setItems([...items.filter((el, i) => i != index)])
                              }
                            >
                              <IconTrash />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                        </div>
                        <ul>
                          <li>
                            <details className="group/sub mt-3">
                              <summary className="flex justify-between gap-3 bg-stone-200 px-2 py-2 font-medium marker:content-none hover:cursor-pointer">
                                <div className="flex items-center">
                                  <IconArrowDown className="mr-2 transition group-open/sub:rotate-180" />
                                  <p className="font-bold">
                                    จำนวนนับและสมบัติของจำนวนนับ 1
                                  </p>
                                </div>
                                <p>{items.length} ด่าน</p>
                              </summary>

                              <article className="border-t-2 py-4">
                                <p className="mb-5 w-full bg-green-200 px-2">ด่านบอส</p>
                                <div className="grid w-full grid-cols-5">
                                  <CWInputCheckbox
                                    value={1}
                                    label="1"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={2}
                                    label="2"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={3}
                                    label="3"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={4}
                                    label="4"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={5}
                                    label="5"
                                    disabled={mode == 'view'}
                                  />
                                </div>
                              </article>
                            </details>
                          </li>
                        </ul>
                      </div>
                    ))}
                    <hr className="my-5" />
                    {mode == 'edit' && (
                      <CWButton
                        title="เพิ่มบทเรียน"
                        variant="primary"
                        outline={true}
                        onClick={() => setItems([...items, items.length])}
                      />
                    )}
                  </article>
                </details>
              </li>
            </ul>
            <ul className="mx-auto mb-5 w-full divide-y rounded border bg-white shadow-md">
              <li>
                <details className="group/main px-4">
                  <summary className="flex justify-between gap-3 px-4 py-2 font-medium marker:content-none hover:cursor-pointer">
                    <div className="flex items-center">
                      <IconArrowDown className="mr-2 transition group-open/main:rotate-180" />
                      <CWInputCheckbox
                        className="text-[18px] font-bold"
                        label="ด่านประเมินหลังเรียน"
                        name="post-evaluate"
                        value="post-evaluate"
                        disabled={mode == 'view'}
                        onChange={(e) => console.log('Selected:', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center">
                      <h1 className="mr-4">
                        <span className="text-danger">*</span>Weight
                      </h1>
                      <CWInput
                        placeholder={'30'}
                        required={true}
                        disabled={mode == 'view'}
                        onChange={(e) => console.log(e)}
                      />
                    </div>
                  </summary>

                  <article className="border-t-2 px-4 py-4">
                    <h1 className="text-[18px] font-bold">
                      เลือกบทเรียนที่นำมาคำนวณคะแนน
                    </h1>
                    <hr className="mb-5" />
                    {items.map((item, index) => (
                      <div className="w-full">
                        <div className="flex justify-between">
                          <p className="my-4 font-bold">บทเรียนที่ {index + 1}</p>
                          {mode == 'edit' && (
                            <button
                              onClick={() =>
                                setItems([...items.filter((el, i) => i != index)])
                              }
                            >
                              <IconTrash />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                          <CWInput
                            label="บทเรียนหลัก"
                            required={true}
                            disabled={mode == 'view'}
                          />
                        </div>
                        <ul>
                          <li>
                            <details className="group/sub mt-3">
                              <summary className="flex justify-between gap-3 bg-stone-200 px-2 py-2 font-medium marker:content-none hover:cursor-pointer">
                                <div className="flex items-center">
                                  <IconArrowDown className="mr-2 transition group-open/sub:rotate-180" />
                                  <p className="font-bold">
                                    จำนวนนับและสมบัติของจำนวนนับ 1
                                  </p>
                                </div>
                                <p>{items.length} ด่าน</p>
                              </summary>

                              <article className="border-t-2 py-4">
                                <p className="mb-5 w-full bg-green-200 px-2">หลังเรียน</p>
                                <div className="grid w-full grid-cols-5">
                                  <CWInputCheckbox
                                    value={1}
                                    label="1"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={2}
                                    label="2"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={3}
                                    label="3"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={4}
                                    label="4"
                                    disabled={mode == 'view'}
                                  />
                                  <CWInputCheckbox
                                    value={5}
                                    label="5"
                                    disabled={mode == 'view'}
                                  />
                                </div>
                              </article>
                            </details>
                          </li>
                        </ul>
                      </div>
                    ))}
                    <hr className="my-5" />
                    {mode == 'edit' && (
                      <CWButton
                        title="เพิ่มบทเรียน"
                        variant="primary"
                        outline={true}
                        onClick={() => setItems([...items, items.length])}
                      />
                    )}
                  </article>
                </details>
              </li>
            </ul>
            <ul className="mx-auto mb-5 w-full divide-y rounded border bg-white shadow-md">
              <li>
                <details className="group/main px-4">
                  <summary className="flex justify-between gap-3 px-4 py-2 font-medium marker:content-none hover:cursor-pointer">
                    <div className="flex items-center">
                      <IconArrowDown className="mr-2 transition group-open/main:rotate-180" />
                      <CWInputCheckbox
                        className="text-[18px] font-bold"
                        label="จิตพิสัย"
                        name="pre-evaluate"
                        value="pre-evaluate"
                        disabled={mode == 'view'}
                        onChange={(e) => console.log('Selected:', e.target.value)}
                      />
                    </div>
                  </summary>

                  <article className="border-t-2 px-4 py-4">
                    {items2.map((item, index) => (
                      <div className="w-full">
                        <div className="mb-3 flex w-full flex-row items-end gap-5">
                          <CWInput
                            label={`หัวข้อ#${index + 1}`}
                            required={true}
                            className={`${mode == 'edit' ? 'w-3/4' : 'w-4/5'}`}
                            disabled={mode == 'view'}
                          />
                          <CWInput
                            label="Weight"
                            required={true}
                            disabled={mode == 'view'}
                          />
                          {mode == 'edit' && (
                            <button
                              className="my-auto pt-7"
                              onClick={() =>
                                setItems2([...items2.filter((el, i) => i != index)])
                              }
                            >
                              <IconTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <hr className="my-5" />
                    {mode == 'edit' && (
                      <CWButton
                        title="เพิ่มหัวข้อ"
                        variant="primary"
                        outline={true}
                        onClick={() => setItems2([...items2, items2.length])}
                      />
                    )}
                  </article>
                </details>
              </li>
            </ul>
            <CWNeutralBox className="mb-5 flex items-center justify-between py-3">
              <h1 className="text-[18px] font-bold">ผลรวมน้ำหนัก(Weight)</h1>
              <h1 className="text-[18px] font-bold">100</h1>
            </CWNeutralBox>
          </>
        )}
        <div
          className={`flex w-full ${mode == 'edit' || true ? 'justify-between' : 'justify-center'} items-center`}
        >
          {mode == 'edit' || true ? (
            <>
              <CWButton
                title="ยกเลิก"
                variant="primary"
                outline={true}
                onClick={() => onClose()}
              />
              <CWButton title="บันทึก" variant="primary" outline={false} />
            </>
          ) : (
            <CWButton
              title="ปิดหน้าต่าง"
              variant="primary"
              outline={true}
              onClick={() => onClose()}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SettingModal;
