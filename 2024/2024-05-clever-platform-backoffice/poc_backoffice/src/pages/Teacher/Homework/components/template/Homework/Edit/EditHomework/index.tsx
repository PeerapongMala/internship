import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import InfoHomework from '../InfoHomework'
import SentHomework from '../SentHomework'
// import ModalQuestion from '../modal/ModalQuestion'

const Edithomework = () => {
  const { subjectId } = useParams()
  const [dataSubject, setDataSubject] = useState()


  // useEffect(() =>{
  //     API.Subject.SubjectAll.Get()
  //     .then((res) => {
  //         return res.json();
  //       })
  //       .then((data) => {
  //         setDataSubject(data);
  //       })
  //       .catch((err) => console.error(err));
  // },[])

  let time = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  const byAdmin = "Admin GM"
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const [activeTablist, setActiveTablist] = useState('0');
  return (
    <div className='w-full'>
      <div className='w-full flex '>
        <div>
          <p className='text-primary'>เกี่ยวกับหลักสูตร / <span>การบ้าน</span></p>

          <div className='flex items-center gap-5 my-8'>
            <button
              onClick={handleBack}
              className=""
            >
              ย้อนกลับ
            </button>
            <h1 className='text-[24px] font-bold'>ดูการบ้าน</h1>
          </div>

        </div>

      </div>
      <div className='w-full bg-gray-100 px-5 py-3'>
        <h1 className='text-[24px] font-bold'>คณิตศาสตร์ ป4/1 / บทที่ 1 จำนวนนับ</h1>
        <p>วันที่สั่ง</p>
      </div>
      <div className=''>

        <div className="w-full mt-5">
          {/* Tabs */}
          <div className="flex bg-white shadow-sm ">
            <button
              onClick={() => setActiveTablist('0')}
              className={`px-5 py-1 text-[14px] text-black ${activeTablist === '0' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ข้อมูลการบ้าน
            </button>
            <button
              onClick={() => setActiveTablist('1')}
              className={`px-5 py-1 text-black ${activeTablist === '1' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ข้อมูลการส่งการบ้าน
            </button>
          </div>

          {/* Content */}
          <div className="w-full mt-5 ">
            {activeTablist === '0' ? (
              <InfoHomework />
            ) : (
              <SentHomework />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}






export default Edithomework