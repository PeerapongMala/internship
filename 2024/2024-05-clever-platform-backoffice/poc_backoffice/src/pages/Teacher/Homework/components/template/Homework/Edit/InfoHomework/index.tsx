import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import subjectData from '../../subject.json'
import ModalQuestion from '../../../../modal/ModalQuestion/index';
import ProgressBar from '../../../../organisms/Progressbar';

const InfoHomework = () => {

  const [homeworkData, setHomeworkData] = useState(subjectData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const totalPages = Math.ceil(homeworkData.length / itemsPerPage);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = homeworkData.slice(indexOfFirstItem, indexOfLastItem);


  const [isOpen, setIsOpen] = useState(false);
  const openModal = (subjectId: string) => {
    setSelectedId(subjectId);
    setIsOpen(true);
  };

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  }
  const handleCloseModal = () => {
    setShowModal(false);
  }

  return (
    <div className='w-full px-5 rounded-md bg-white shadow'>
      <div className='p-5'>
        <table className='table-auto '>
          <thead className='bg-gray-50'>
            <tr>
              <th>#</th>
              <th>บทเรียนย่อย</th>
              <th>ด่านที่</th>
              <th>รูปแบบคำถาม</th>
              <th>ระดับ</th>
              <th>คะแนนรวมเฉลี่ย</th>
              <th>ทำข้อสอบแล้ว</th>
              <th>ทำข้อสอบโดยเฉลี่ย</th>
              <th>ทำข้อสอบแล้ว(ครั้ง)</th>
              <th>เวลาเฉลี่ยต่อข้อ</th>
              <th>ทำข้อสอบล่าสุด</th>
              <th>ดูคำถาม</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((data, index) => (
              <tr key={index}>
                <td>{data.subjectId}</td>
                <td>{data.sublesson}</td>
                <td>{data.checkpoint}</td>
                <td>{data.queusetion}</td>
                <td>
                  <p > <span className={`font-bold px-2 whitespace-nowrap ${data.tier === 'ง่าย' ? 'text-green-500 border border-green-500 rounded-md' :
                    data.tier === 'ปานกลาง' ? 'text-orange-500  border border-orange-500 rounded-md' :
                      data.tier === 'ยาก' ? 'text-red-500 border border-red-500 rounded-md' :
                        ''
                    }`}> {data.tier}</span></p>
                </td>
                <td >
                  <div className='flex flex-col justify-end items-end'>
                    <p >{data.totalAvg}/300</p>
                    <ProgressBar score={data.totalAvg} total={300} />
                  </div>

                </td>
                <td >
                  <div className='flex flex-col justify-end items-end'>
                    <p >{data.readyexam}/30</p>
                    <ProgressBar score={data.readyexam} total={30} />
                  </div>
                </td>
                <td>{data.readyexamAvg}</td>
                <td>{data.examAvg}</td>
                <td>{data.time}</td>
                <td>{data.date}</td>
                <td>
                  <button onClick={handleShowModal} className="">ดูคำตอบ</button>
                  <ModalQuestion
                    open={showModal}
                    onClose={handleCloseModal}
                    subjectId={data.subjectId}
                  /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='w-full flex justify-between items-center mt-10 pb-5'>
          <div className='flex gap-5 items-center'>
            <div>
              <p className='w-full'>แสดงจาก 1 จาก 12 หน้า</p>
            </div>
            <div>
              <select value={itemsPerPage} onChange={handleItemsPerPageChange} className='form-select w-20'>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
          <div>
            <div className="pagination flex justify-center items-center space-x-2 mt-4">
              {/* back */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`size-10 border rounded-full ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-slate-300 text-black'
                  }`}
              >
                {"<"}
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`size-10 border rounded-full ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-slate-300 text-black'
                    } hover:bg-blue-500 hover:text-white transition`}
                >
                  {index + 1}
                </button>
              ))}

              {/* necxt */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`size-10 border rounded-full ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-slate-300 text-black'
                  }`}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoHomework