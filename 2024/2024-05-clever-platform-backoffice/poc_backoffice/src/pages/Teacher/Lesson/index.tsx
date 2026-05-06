import { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from './components/atoms/Box'
import { Select } from '@/components/Input'
import LessonData from './api/lesson.json'
import FilterTabs from './components/organism/FilterTabs'
import Pagination from './components/organism/Pagination'
import SelectItemPage from './components/organism/SelectItemPage'
import IconSearch from '@/components/Icon/IconSearch'


const Lesson = () => {

    const [lessonData, setLessonData] = useState(LessonData)
    const [activeFilter, setActiveFilter] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filter, setFilter] = useState('');
    const number = lessonData.length

    const [itemsPerPage, setItemsPerPage] = useState<number>(5);


    const handleFilterUsed = (usedStatus: string) => {
        setFilter(usedStatus);
        setActiveFilter(usedStatus);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const filteredData = filter ? lessonData.filter((homework) => homework.usedStatus === filter) : lessonData;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const [isActiveToggle, setIsActiveToggle] = useState<boolean>(false);
    // const toggleStatus = () => {
    //   setIsActiveToggle(prev => !prev);
    // };
    const toggleStatus = (subjectId: string) => {
        setLessonData(prevData =>
            prevData.map(data =>
                data.subjectId === subjectId
                    ? { ...data, usedStatus: data.usedStatus === 'ใช้งาน' ? 'ไม่ใช้งาน' : 'ใช้งาน' }
                    : data
            )
        );
    };




    return (

        <div className='w-full'>
            <div className='flex gap-1'>
                <p className='text-primary'>โรงเรียนสาธิตมัธยม</p>
                <p className='text-primary'>  / การเรียนการสอน</p>
                <p>  / จัดการบทเรียน</p>
            </div>
            <div className='flex flex-col mt-5 w-full bg-gray-100 px-2 py-3 rounded-md shadow-md'>
                <div className='flex'>
                    <img src="" alt="" />
                    <h1 className='text-[24px] font-bold'>โรงเรียนสาธิตมัธยม</h1>
                </div>
                <div className='mt-3'>
                    <p>รหัสโรงเรียน : 000000000001 (ตัวย่อ:AA109)</p>
                </div>
            </div>
            <div className='w-full mb-5'>
                <div className='my-5'>
                    <h1 className='font-bold text-[28px]'>บทเรียนหลัก</h1>
                    <p className='mt-2'>{number} บทเรียน</p>
                </div>

                <Box>
                    <div className='flex gap-5 xl:w-[1100px]'>

                        <select className='form-select text-gray-500'>
                            <option value="">หลักสูตร</option>
                        </select>
                        <select className='form-select text-gray-500'>
                            <option value="">ชั้นปี</option>
                        </select>
                        <select className='form-select text-gray-500'>
                            <option value="">ห้อง</option>
                        </select>
                        <select className='form-select text-gray-500'>
                            <option value="">วิชา</option>
                        </select>

                    </div>
                    <div className='w-full mt-10'>

                        <div className='w-full'>
                            <FilterTabs activeFilter={activeFilter} onFilterChange={handleFilterUsed} />
                        </div>
                        <div className='w-full mt-5'>
                            <table className='table-auto w-full '>
                                <thead className='bg-gray-100'>
                                    <tr>
                                        <th>
                                            <div className='flex'>
                                                <input type="checkbox" className='form-checkbox bg-white' />
                                                #
                                            </div>
                                        </th>
                                        <th >รหัสบทเรียน</th>
                                        <th>หลักสูตร</th>
                                        <th>วิชา</th>
                                        <th>ช้นปี</th>
                                        <th>บทเรียนหลัก</th>
                                        <th>เปิดใช้บทเรียน</th>
                                        <th>ดูรายละเอียด</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((data, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className='flex'>
                                                    <input type="checkbox" className='form-checkbox bg-white' />
                                                    {data.subjectId}
                                                </div>
                                            </td>
                                            <td >{data.lessonCode}</td>
                                            <td>{data.course}</td>
                                            <td>{data.subjectName}</td>
                                            <td>{data.year}</td>
                                            <td>{data.lessons[0]?.lessonsName}</td>
                                            <td>
                                                <div
                                                    onClick={() => toggleStatus(data.subjectId)}
                                                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${data.usedStatus === 'ใช้งาน' ? 'bg-green-500' : 'bg-gray-300'}`}
                                                >
                                                    <div
                                                        className={`bg-white size-4 rounded-full shadow-md transform transition-transform duration-300 ${data.usedStatus === 'ใช้งาน' ? 'translate-x-6' : ''}`}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <Link to={`/teacher/sublesson/${data.subjectId}`}>
                                                    <button>
                                                        <IconSearch />
                                                    </button>
                                                </Link>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='w-full flex justify-between items-center mt-10 pb-5'>
                                <div className='flex gap-5 items-center'>
                                    <div>
                                        <p className='w-full'>แสดงจาก 1 จาก {totalPages} หน้า</p>
                                    </div>
                                    <div>
                                        <SelectItemPage value={itemsPerPage} onChange={handleItemsPerPageChange} />
                                    </div>
                                </div>
                                <div>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        handlePageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>


            </div>
        </div>

    )
}

export default Lesson