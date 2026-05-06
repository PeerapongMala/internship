// Import your modal component
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import ModalQuestion from '../../../../local/components/modal/ModalQuestion';
import Select from '@core/design-system/library/component/web/Select';
import Input from '@core/design-system/library/component/web/Input';
import { optionYear } from '@domain/g03/g03-d06/local/options';
import IconArrowUp from '@core/design-system/library/component/icon/IconArrowUp';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import CWSelectValue from '@component/web/cw-selectValue';
import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';

const SelectLesson = () => {
  const dataTier = [
    {
      id: 1,
      tier: 'ง่าย',
    },
    {
      id: 2,
      tier: 'ง่าย',
    },
    {
      id: 3,
      tier: 'ง่าย',
    },
    {
      id: 4,
      tier: 'ปานกลาง',
    },
    {
      id: 5,
      tier: 'ปานกลาง',
    },
    {
      id: 6,
      tier: 'ปานกลาง',
    },
    {
      id: 7,
      tier: 'ยาก',
    },
    {
      id: 8,
      tier: 'ยาก',
    },
    {
      id: 9,
      tier: 'ยาก',
    },
  ];

  const [openAccordions, setOpenAccordions] = useState([false, false]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState(Array(dataTier.length).fill(false));
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');

  const handleYearChange = (value: any) => {
    console.log('Selected Year:', value);
    setSelectedYear(value);
  };

  const handleLessonChange = (value: any) => {
    console.log('Selected Lesson:', value);
    setSelectedLesson(value);
  };
  const toggleAccordion = (index: number) => {
    setOpenAccordions((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleCheckboxChange = (index: number) => {
    setCheckedItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = !updatedItems[index];
      return updatedItems;
    });
  };
  const openModal = (id: number) => {
    setSelectedId(id);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);
  return (
    <div className="w-full">
      <div className="w-full bg-white p-5">
        <div className="mb-10 mt-5">
          <h1 className="text-[24px] font-bold">ข้อมูลการบ้าน</h1>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-5">
          <CWInput placeholder="คณิตศาสตร์" className="col-span-1" label={'วิชา'} />
          <CWSelectValue
            options={optionYear}
            className="col-span-1"
            value={selectedYear}
            onChange={handleYearChange}
            label={'ชั้นปี'}
            title="ชั้นปี"
          />
        </div>
      </div>
      <div className="mt-5 w-full bg-white p-5">
        <h1 className="py-5 text-[20px] font-bold">บทเรียนหลัก</h1>

        <CWSelectValue
          options={optionYear}
          className="w-[400px]"
          value={selectedLesson}
          onChange={handleLessonChange}
          title="บทที่ 1 จำนวนนับ"
        />

        <div className="w-full">
          <h1 className="py-5 text-[20px] font-bold">บทเรียนหลักย่อย</h1>

          {/* Accordion 1 */}
          <div className="mb-5 w-full px-2">
            <div className="flex items-center justify-between bg-gray-100 pr-4">
              <button
                onClick={() => toggleAccordion(0)}
                className="flex gap-1 bg-gray-100 px-4 py-2 font-bold"
              >
                {openAccordions[0] ? (
                  <span className="mr-2">
                    <IconArrowDown />
                  </span> // ลูกศรชี้ลง
                ) : (
                  <span className="mr-2">
                    <IconArrowUp />
                  </span> // ลูกศรชี้ขึ้น
                )}
                จำนวนนับและสมบัติของจำนวนนับ 1
              </button>
              <p>ด่าน 2</p>
            </div>
            {openAccordions[0] && (
              <div className="mt-3 bg-gray-50 p-4">
                <div>
                  <p className="w-full bg-emerald-300 px-0.5 py-0.5">ง่าย</p>
                  <div className="flex justify-around gap-5 py-5">
                    {dataTier
                      .filter((data) => data.tier === 'ง่าย')
                      .map((data, index) => (
                        <div className="flex" key={index}>
                          <input
                            type="checkbox"
                            checked={checkedItems[data.id - 1]}
                            onChange={() => handleCheckboxChange(data.id - 1)}
                            className="mr-2 hover:cursor-pointer"
                          />
                          <button
                            className="text-primary underline decoration-primary"
                            onClick={() => openModal(data.id)} // ส่ง ID ของ item ที่เลือก
                          >
                            {data.id}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <p className="w-full bg-yellow-300 px-0.5 py-0.5">ปานกลาง</p>
                  <div className="flex justify-around gap-5 py-5">
                    {dataTier
                      .filter((data) => data.tier === 'ปานกลาง')
                      .map((data, index) => (
                        <div className="flex" key={index}>
                          <input
                            type="checkbox"
                            checked={checkedItems[data.id - 1]}
                            onChange={() => handleCheckboxChange(data.id - 1)}
                            className="mr-2 hover:cursor-pointer"
                          />
                          <button
                            className="text-primary underline decoration-primary"
                            onClick={() => openModal(data.id)} // ส่ง ID ของ item ที่เลือก
                          >
                            {data.id}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <p className="w-full bg-red-300 px-0.5 py-0.5">ยาก</p>
                  <div className="flex justify-around gap-5 py-5">
                    {dataTier
                      .filter((data) => data.tier === 'ยาก')
                      .map((data, index) => (
                        <div className="flex" key={index}>
                          <input
                            type="checkbox"
                            checked={checkedItems[data.id - 1]}
                            onChange={() => handleCheckboxChange(data.id - 1)}
                            className="mr-2 hover:cursor-pointer"
                          />
                          <button
                            className="text-primary underline decoration-primary"
                            onClick={() => openModal(data.id)} // ส่ง ID ของ item ที่เลือก
                          >
                            {data.id}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
            {/* {selectedId && <ModalQuestion open={isOpen} onClose={closeModal} subjectId={selectedId.toString()} />} */}
            <CWModalQuestionView
              open={isOpen}
              onClose={closeModal}
              // CWModalQuestionView_please_fix_this_for_real_data
              levelId={selectedId ?? 2}
              // levelPlayLogId={1}
            />
          </div>

          {/* Accordion 2 */}
          <div className="mb-5 w-full px-2">
            <div className="flex items-center justify-between bg-gray-100 pr-4">
              <button
                onClick={() => toggleAccordion(1)}
                className="flex gap-1 bg-gray-100 px-4 py-2 font-bold"
              >
                {openAccordions[1] ? (
                  <span className="mr-2">
                    <IconArrowDown />
                  </span>
                ) : (
                  <span className="mr-2">
                    <IconArrowUp />
                  </span>
                )}
                จำนวนนับและสมบัติของจำนวนนับ 2
              </button>
              <p>ด่าน 2</p>
            </div>
            {openAccordions[1] && (
              <div className="mt-3 bg-gray-50 p-4">
                <div>
                  <p className="w-full bg-emerald-300 px-0.5 py-0.5">ง่าย</p>
                  <div className="flex justify-around gap-5 py-5">
                    {dataTier
                      .filter((data) => data.tier === 'ง่าย')
                      .map((data, index) => (
                        <div className="flex" key={index}>
                          <input
                            type="checkbox"
                            checked={checkedItems[data.id - 1]}
                            onChange={() => handleCheckboxChange(data.id - 1)}
                            className="mr-2 hover:cursor-pointer"
                          />
                          <button
                            className="text-primary underline decoration-primary"
                            onClick={() => openModal(data.id)} // ส่ง ID ของ item ที่เลือก
                          >
                            {data.id}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <p className="w-full bg-yellow-300 px-0.5 py-0.5">ปานกลาง</p>
                  <div className="flex justify-around gap-5 py-5">
                    {dataTier
                      .filter((data) => data.tier === 'ปานกลาง')
                      .map((data, index) => (
                        <div className="flex" key={index}>
                          <input
                            type="checkbox"
                            checked={checkedItems[data.id - 1]}
                            onChange={() => handleCheckboxChange(data.id - 1)}
                            className="mr-2 hover:cursor-pointer"
                          />
                          <button
                            className="text-primary underline decoration-primary"
                            onClick={() => openModal(data.id)} // ส่ง ID ของ item ที่เลือก
                          >
                            {data.id}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <p className="w-full bg-red-300 px-0.5 py-0.5">ยาก</p>
                  <div className="flex justify-around gap-5 py-5">
                    {dataTier
                      .filter((data) => data.tier === 'ยาก')
                      .map((data, index) => (
                        <div className="flex" key={index}>
                          <input
                            type="checkbox"
                            checked={checkedItems[data.id - 1]}
                            onChange={() => handleCheckboxChange(data.id - 1)}
                            className="mr-2 hover:cursor-pointer"
                          />
                          <button
                            className="text-primary underline decoration-primary"
                            onClick={() => openModal(data.id)} // ส่ง ID ของ item ที่เลือก
                          >
                            {data.id}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 3 */}
          <div className="mb-5 w-full px-2">
            <div className="flex items-center justify-between bg-gray-100 pr-4">
              <button
                onClick={() => toggleAccordion(2)}
                className="flex gap-1 bg-gray-100 px-4 py-2 font-bold"
              >
                {openAccordions[2] ? (
                  <span className="mr-2">
                    <IconArrowDown />
                  </span>
                ) : (
                  <span className="mr-2">
                    <IconArrowUp />
                  </span>
                )}
                การบวก ลบ คูณ หารระคน
              </button>
              <p>ด่าน 2</p>
            </div>
            {openAccordions[2] && (
              <div className="mt-3 bg-gray-200 p-4">
                <p>ง่าย</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectLesson;
