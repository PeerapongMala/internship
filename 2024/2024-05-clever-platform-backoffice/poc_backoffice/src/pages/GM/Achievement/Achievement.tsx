import { useState, useEffect } from 'react';
import Select from 'react-select';
import Input from 'react-select/dist/declarations/src/components/Input';
import ModalCheckpoint from './components/modal/ModalCheckpoint';
import { Link, useParams } from 'react-router-dom';

const optionsColumn = [
  { value: 'วิชา', label: 'วิชา' },
  { value: '2-col', label: '2 คอลัมน์' },
  { value: '3-col', label: '3 คอลัมน์' },
  { value: '4-col', label: '4 คอลัมน์' },
  { value: '1-row', label: '1 แถว' },
  { value: '2-row', label: '2 แถว' },
  { value: '3-row', label: '3 แถว' },
  { value: '4-row', label: '4 แถว' },
];
const optionsSubject = [
  { value: 'วิชา', label: 'วิชา' },
  { value: '2-col', label: 'คณิตศาสตร์' },
  { value: '3-col', label: 'อังกฤษ' },
  { value: '4-col', label: 'ไทย' },
];
const optionsLesson = [
  { value: 'บทที่ 1 จำนวนนับ', label: 'บทที่ 1 จำนวนนับ' },
  { value: '2-col', label: '2 คอลัมน์' },
  { value: '3-col', label: '3 คอลัมน์' },
  { value: '4-col', label: '4 คอลัมน์' },

];
const optionsMiniLesson = [
  { value: 'บทเรียนย่อย', label: 'บทเรียนย่อย' },
  { value: '2-col', label: 'บทที่ 1 จำนวนนับ' },
  { value: '3-col', label: '3 คอลัมน์' },
  { value: '4-col', label: '4 คอลัมน์' },
];
const editing = [
  {
    updatenow: new Date().toISOString(),
    updateon: "Admin GM",
  }
]
let time = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
const byAdmin = "Admin GM"
// interface DataTable {
//     checkpointId: number;
//     title: string;
//     checkpoint: string;
//     type: string;
//     question: string;
//     tier: 'ง่าย' | 'ปานกลาง' | 'ยาก';
//     reward: number;
//     updatenow: string;
//     updateon: string;
// }

const datatables = [
  {
    checkpointId: "001",
    title: "บทที่ 1 จำนวนนับ",
    checkpoint: 1,
    type: "แบบฝึกหัด",
    question: "ปรนัยแบบเลือกตอบ",
    tier: "ง่าย",
    reward: 1,
    updatenow: new Date().toISOString(),
    updateon: "Admin GM",

  },
  {
    checkpointId: "002",
    title: "บทที่ 1 จำนวนนับ",
    checkpoint: 1,
    type: "แบบฝึกหัด",
    question: "ปรนัยแบบเลือกตอบ",
    tier: "ปานกลาง",
    reward: 1,
    updatenow: new Date().toISOString(),
    updateon: "Admin GM",

  },
  {
    checkpointId: "003",
    title: "บทที่ 1 จำนวนนับ",
    checkpoint: 1,
    type: "แบบฝึกหัด",
    question: "ปรนัยแบบเลือกตอบ",
    tier: "ยาก",
    reward: 1,
    updatenow: new Date().toISOString(),
    updateon: "Admin GM",

  },
  {
    checkpointId: "004",
    title: "บทที่ 1 จำนวนนับ",
    checkpoint: 1,
    type: "แบบฝึกหัด",
    question: "ปรนัยแบบเลือกตอบ",
    tier: "ง่าย",
    reward: 1,
    updatenow: new Date().toISOString(),
    updateon: "Admin GM",

  },
]


const Achievement = () => {
  const [activeTablist, setActiveTablist] = useState('0');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLayoutRatio, setSelectedLayoutRatio] = useState('1:1');
  const [selectedLayoutPattern, setSelectedLayoutPattern] = useState('horizontal');
  const [selectedPatternAnswer, setSelectedPatternAnswer] = useState('2-col');
  const [selectedPatternGroup, setSelectedPatternGroup] = useState('2-col');
  const [selectedAnswerType, setSelectedAnswerType] = useState('text');
  const [selectedAnswerCount, setSelectedAnswerCount] = useState(5);
  const [inputTopic, setInputTopic] = useState('');
  const [inputQustion, setInputQustion] = useState('');
  const [inputHint, setInputHint] = useState('');



  const handleChangeOptions = (key: string, value: string) => {
    if (/^answer_\d+$/.test(key)) {
      const index = parseInt(key.split('_')[1]);

    } else {
      switch (key) {
        case 'position':
          setSelectedSubject(value);
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      sendLocalStorageToIframe();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [selectedSubject]);

  const sendLocalStorageToIframe = () => {
    console.log('sendLocalStorageToIframe');

    const gameConfig = JSON.stringify({
      patternGroup: selectedSubject,
    });

    localStorage.setItem('game-config', gameConfig);

    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      const localStorageData = JSON.stringify({ 'game-config': gameConfig });
      iframe.contentWindow.postMessage(localStorageData, '*');
    }
  };

  return (
    <div className="w-full">
      <div className='w-full py-3'>
        <p className='text-primary'>ระบบเกม / <span className='text-black'>จัดการรางวัลด่าน</span></p>
      </div>
      <div className='flex flex-col gap-3 my-5'>
        <h1 className='text-[24px] font-bold' >จัดการรางวัลด่าน</h1>
        <p>ผู้เล่นจะได้รับรางวัลเมื่อผ่านด่านตามรางวัลที่กำหนด ตั้งค่าจำนวนเหรียญทอง เหรียญ Arcade หรือรางวัลพิเศษของแต่ละด่าน</p>
      </div>
      <div className="w-full mt-5">
        {/* Tabs */}
        <div className="flex bg-white shadow-sm ">
          <button
            onClick={() => setActiveTablist('0')}
            className={`px-8 py-1 text-[14px] text-black ${activeTablist === '0' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
          >
            รางวัลทั่วไป
          </button>
          <button
            onClick={() => setActiveTablist('1')}
            className={`px-8 py-1 text-black ${activeTablist === '1' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
          >
            รางวัลพิเศษ
          </button>
        </div>

        {/* Content */}
        <div className="w-full mt-5 ">
          {activeTablist === '0' ? (
            <RewardNomal optionsColumn={optionsColumn} handleChangeOptions={handleChangeOptions} />
          ) : (
            <RewardSpecial />
          )}
        </div>
      </div>
    </div>
  );
};

const RewardNomal = ({ optionsColumn, handleChangeOptions }: {
  optionsColumn: { value: string, label: string }[]
  handleChangeOptions: (key: string, value: string) => void
}) => {
  const [activeTablistMode, setActiveTablistMode] = useState('0');
  return (
    <div className='w-full '>
      <div className="w-full mt-5">
        <Select
          className="w-[300px]"
          defaultValue={optionsColumn[0]}
          options={optionsColumn}
          isSearchable={false}
          onChange={(e) => handleChangeOptions('answerColumn', e?.value ?? '')}
        />
      </div>
      <div className='w-full h-auto mt-5 bg-white rounded-xl shadow-md'>
        <div className='w-full h-auto'>
          <div className="flex h-auto bg-white shadow-sm  ">
            <button
              onClick={() => setActiveTablistMode('0')}
              className={`px-8 py-1 text-[14px] text-black ${activeTablistMode === '0' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ด่านระดับง่าย
            </button>
            <button
              onClick={() => setActiveTablistMode('1')}
              className={`px-8 py-1 text-black ${activeTablistMode === '1' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ด่านระดับปานกลาง
            </button>
            <button
              onClick={() => setActiveTablistMode('2')}
              className={`px-8 py-1 text-[14px] text-black ${activeTablistMode === '2' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ด่านระดับยาก
            </button>

            <button
              onClick={() => setActiveTablistMode('3')}
              className={`px-8 py-1 text-black ${activeTablistMode === '3' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ด่านระดับบอส
            </button>

          </div>
          <div className="w-full h-auto mt-5 pb-5">
            {activeTablistMode === '0' ? (
              <EasyMode />
            ) : activeTablistMode === '1' ? (
              <MiddleMode />
            ) : activeTablistMode === '2' ? (
              <HardMode />
            ) : (
              <BossMode />
            )}
          </div>
        </div>
      </div>

    </div>
  );
};



const EasyMode = () => {

  return (
    <div className='w-full  px-5'>
      <form>
        <div className='h-full flex justify-between gap-5'>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 1 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='25' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 2 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='30' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 3 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='50' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
        </div>

        <div className='w-full h-auto mt-5'>
          <div className='w-full h-auto bg-gray-100 px-5 py-5 rounded-[5px] flex flex-col md:flex-row  items-center gap-10'>
            <div className='flex gap-5'>
              <button className='px-10 py-2 bg-primary shadow-xl rounded-md text-white font-bold border border-primary'>บันทึก</button>
              <button className='px-10 py-2 bg-white shadow-xl rounded-md text-primary font-bold border border-primary'>ยกเลิก</button>
            </div>

            {/* ใช้ flex-col ใน mobile เพื่อให้เวลาไปอยู่ข้างล่าง */}
            <div className='flex flex-col md:flex-row justify-center items-center gap-2 '>
              <p>แก้ไขล่าสุด:</p>
              <div className='flex gap-2'>
                <h1>{time},</h1>
                <h1>{byAdmin}</h1>
              </div>

            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
const MiddleMode = () => {
  return <div>
    <div className='w-full px-5'>
      <form>
        <div className='h-full flex justify-between gap-5'>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 1 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='25' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 2 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='30' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 3 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='50' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
        </div>

        <div className='w-full h-auto mt-5'>
          <div className='w-full h-auto bg-gray-100 px-5 py-5 rounded-[5px] flex flex-col md:flex-row  items-center gap-10'>
            <div className='flex gap-5'>
              <button className='px-10 py-2 bg-primary shadow-xl rounded-md text-white font-bold border border-primary'>บันทึก</button>
              <button className='px-10 py-2 bg-white shadow-xl rounded-md text-primary font-bold border border-primary'>ยกเลิก</button>
            </div>


            <div className='flex flex-col md:flex-row justify-center items-center gap-2 '>
              <p>แก้ไขล่าสุด:</p>
              <div className='flex gap-2'>
                <h1>{time},</h1>
                <h1>{byAdmin}</h1>
              </div>

            </div>
          </div>
        </div>
      </form>

    </div>
  </div>
}
const HardMode = () => {
  return <div>
    <div className='w-full px-5'>
      <form>
        <div className='h-full flex justify-between gap-5'>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 1 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='25' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 2 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='50' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 3 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='50' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
        </div>

        <div className='w-full h-auto mt-5'>
          <div className='w-full h-auto bg-gray-100 px-5 py-5 rounded-[5px] flex flex-col md:flex-row  items-center gap-10'>
            <div className='flex gap-5'>
              <button className='px-10 py-2 bg-primary shadow-xl rounded-md text-white font-bold border border-primary'>บันทึก</button>
              <button className='px-10 py-2 bg-white shadow-xl rounded-md text-primary font-bold border border-primary'>ยกเลิก</button>
            </div>


            <div className='flex flex-col md:flex-row justify-center items-center gap-2 '>
              <p>แก้ไขล่าสุด:</p>
              <div className='flex gap-2'>
                <h1>{time},</h1>
                <h1>{byAdmin}</h1>
              </div>

            </div>
          </div>
        </div>
      </form>

    </div>
  </div>
}
const BossMode = () => {
  return <div>
    <div className='w-full px-5'>
      <form>
        <div className='h-full flex justify-between gap-5'>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 1 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='25' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 1 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='30' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
          <div className='w-full '>
            <div className='bg-zinc-100 py-3 px-4'>
              <h1 className='font-bold text-[18px]'>ผ่านด่านด้วยคะแนน 1 ดาว</h1>
            </div>
            <div className='w-full flex flex-col mt-10'>
              <label htmlFor=""><span className='text-red-500'>*</span>จำนวน (เหรียญทอง):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='50' />
              <label htmlFor="" className='mt-5'><span className='text-red-500 mt-10' >*</span>จำนวน (เหรียญ Arcade):</label>
              <input type="text" className='form-input placeholder:text-gray-300' placeholder='0' />
            </div>
          </div>
        </div>

        <div className='w-full h-auto mt-5'>
          <div className='w-full h-auto bg-gray-100 px-5 py-5 rounded-[5px] flex flex-col md:flex-row  items-center gap-10'>
            <div className='flex gap-5'>
              <button className='px-10 py-2 bg-primary shadow-xl rounded-md text-white font-bold border border-primary'>บันทึก</button>
              <button className='px-10 py-2 bg-white shadow-xl rounded-md text-primary font-bold border border-primary'>ยกเลิก</button>
            </div>


            <div className='flex flex-col md:flex-row justify-center items-center gap-2 '>
              <p>แก้ไขล่าสุด:</p>
              <div className='flex gap-2'>
                <h1>{time},</h1>
                <h1>{byAdmin}</h1>
              </div>

            </div>
          </div>
        </div>
      </form>

    </div>
  </div>
}

const RewardSpecial = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const {id} = useParams()
  return (
    <div className='w-full'>
      <div className="w-full mt-5 flex flex-col lg:flex-row items-center gap-5">
        <Select
          className="w-full lg:w-[300px]"
          defaultValue={optionsSubject[0]}
          options={optionsSubject}
          isSearchable={false}
        />
        <Select
          className="w-full lg:w-[300px]"
          defaultValue={optionsLesson[0]}
          options={optionsLesson}
          isSearchable={false}
        />
        <Select
          className="w-full lg:w-[300px]"
          defaultValue={optionsMiniLesson[0]}
          options={optionsMiniLesson}
          isSearchable={false}
        />
      </div>
      <div className='w-full h-auto mt-5 bg-white rounded-xl shadow-md'>
        <div className='w-full px-5'>
          <div className='w-full flex flex-col lg:flex-row justify-between py-5'>
            <div className='flex flex-col lg:flex-row items-center gap-5'>
              <select className='px-3 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary'>
                <option value="">Bulk Edit</option>
                <option value="">10</option>
                <option value="">15</option>
                <option value="">20</option>
              </select>
              <button className='px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary ' onClick={openModal}>เลือกด่าน</button>
              <ModalCheckpoint isOpen={isOpen} onClose={closeModal} />{/* Modal */}

              <div>
                <input type="text" placeholder='ค้นหา' className='w-full lg:w-[250px] border px-2 py-2 rounded-md' />
              </div>
            </div>
            <div className='mt-3 lg:mt-0 flex justify-center gap-3'>
              <button className='px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary '>CSV</button>
              <button className='px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary '>CSV</button>
            </div>
          </div>
          <div>
            <table className='table-auto w-full'>
              <thead className='bg-gray-100'>
                <tr>
                  <th>รหัสด่าน</th>
                  <th>บทเรียนย่อย</th>
                  <th>ด่านที่</th>
                  <th>ประเภท</th>
                  <th>รูปแบบคำถาม</th>
                  <th>ระดับ</th>
                  <th>จำนวนรางวัล</th>
                  <th>แก้ไขล่าสุด</th>
                  <th>แก้ไขโดย</th>
                  <th>แก้ไข</th>
                  <th>ลบ</th>
                </tr>
              </thead>
              <tbody>
                {datatables.map((data, index) => (
                  <tr key={index}>
                    <td>{data.checkpointId}</td>
                    <td>{data.title}</td>
                    <td>{data.checkpoint}</td>
                    <td>{data.type}</td>
                    <td>{data.question}</td>
                    <td>
                      <p > <span className={`font-bold px-2 whitespace-nowrap ${data.tier === 'ง่าย' ? 'text-green-500 border border-green-500 rounded-md' :
                        data.tier === 'ปานกลาง' ? 'text-orange-500  border border-orange-500 rounded-md' :
                          data.tier === 'ยาก' ? 'text-red-500 border border-red-500 rounded-md' :
                            ''
                        }`}> {data.tier}</span></p>
                    </td>
                    <td>{data.reward}</td>
                    <td>{data.updatenow}</td>
                    <td>{data.updateon}</td>
                    <td><Link to={`/gm/achievement/${data.checkpointId}` }><button>แก้ไข</button></Link></td>
                    <td><button>ลบ</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};




export default Achievement;
