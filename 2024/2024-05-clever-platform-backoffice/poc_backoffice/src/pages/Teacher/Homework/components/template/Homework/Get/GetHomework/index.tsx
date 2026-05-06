import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import subjectData from '../../subject.json'
import ProgressBar from '../../../../organisms/Progressbar';
import people from '../../people.json';
import ModalChat from '../../../../modal/ModalChat';

const Gethomework = ({ active }: { active: (tab: string) => void }) => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };
    const handleViewAnswer = (id: string) => {
        navigate(`/teacher/peplohomework/${id}`);
    };
    const [homeworkData, setHomeworkData] = useState(subjectData);
    const [filter, setFilter] = useState('');
    const [peopleData, setPeopleData] = useState(people);
    const [activeFilter, setActiveFilter] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);


    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const totalPages = Math.ceil(peopleData.length / itemsPerPage);
    const handleFilterClick = (status: string) => {
        setFilter(status);
    };
    const filteredData = filter ? peopleData.filter((homework) => homework.status === filter) : peopleData;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const openModal = (subjectId: string) => {
        setSelectedId(subjectId);
        setIsOpen(true);
    };
    const closeModal = () => setIsOpen(false);

    const datatester = [
        {
            "id": "000001",
            "name": "ชื้อจริง",
            "lastname": "นามสกุล",
            "tier": "score",
            "status": "กำลังทำ",
            "date": "2024-10-21 14:00:00"
        },
        {
            "id": "000002",
            "name": "ชื้อจริง",
            "lastname": "นามสกุล",
            "tier": "score",
            "status": "กำลังทำ",
            "date": "2024-10-21 14:00:00"
        },
        {
            "id": "000003",
            "name": "ชื้อจริง",
            "lastname": "นามสกุล",
            "tier": "score",
            "status": "ตรงเวลา",
            "date": "2024-10-21 14:00:00"
        },
        {
            "id": "000004",
            "name": "ชื้อจริง",
            "lastname": "นามสกุล",
            "tier": "score",
            "status": "เลยกำหนด",
            "date": "2024-10-21 14:00:00"
        },

    ]

    return (
        <div className='full'>
            <div className='w-full px-5'>
                <div className='flex gap-5'>
                    <div className='mt-10 flex gap-5 w-full'>
                        {/* {datatester.map((item, index) => (
                            <div key={index} className='w-full bg-gray-100 rounded-md'>
                                <div className="p-4">
                                    <h1 className="text-xl font-bold">กำลังทำ</h1>
                                    <h1 className="text-xl font-bold">{30}/100</h1>
                                    <ProgressBar score={30} total={100} />
                                </div>
                            </div>
                        ))} */}
                        <div className='w-full bg-gray-100 rounded-md'>
                            <div className="p-4">
                                <h1 className="text-xl font-bold">กำลังทำ</h1>
                                <h1 className="text-xl font-bold">{30}/100</h1>
                                <ProgressBar score={30} total={100} />
                            </div>
                        </div>
                        <div className='w-full bg-gray-100 rounded-md'>
                            <div className="p-4">
                                <h1 className="text-xl font-bold">ตรงเวลา</h1>
                                <h1 className="text-xl font-bold">{30}/100</h1>
                                <ProgressBar score={30} total={100} />
                            </div>
                        </div>
                        <div className='w-full bg-gray-100 rounded-md'>
                            <div className="p-4">
                                <h1 className="text-xl font-bold">ส่งเลยกำหนด</h1>
                                <h1 className="text-xl font-bold">{30}/100</h1>
                                <ProgressBar score={30} total={100} />
                            </div>
                        </div>
                        <div className='w-full bg-gray-100 rounded-md'>
                            <div className="p-4">
                                <h1 className="text-xl font-bold">ยังไม่ได้ส่ง</h1>
                                <h1 className="text-xl font-bold">{30}/100</h1>
                                <ProgressBar score={30} total={100} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-col lg:flex-row justify-between py-5'>
                    <div className='flex flex-col lg:flex-row items-center gap-5'>
                        <select className='px-3 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary'>
                            <option value="">Bulk Edit</option>
                            <option value="">10</option>
                            <option value="">15</option>
                            <option value="">20</option>
                        </select>
                        <Link to={"/teacher/addhomework"}>
                            <button className='px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary'>ส่งข้อความทั้งหมด</button>
                        </Link>
                        <div>
                            <input type="text" placeholder='ค้นหา' className='w-full lg:w-[250px] border px-2 py-2 rounded-md' />
                        </div>
                    </div>
                    <div className='mt-3 lg:mt-0 flex justify-center gap-3'>
                        <button className='px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary'>CSV</button>
                        <button className='px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary'>CSV</button>
                    </div>
                </div>

                <div className='w-full mt-5'>
                    <div className='w-full flex border-b-[1px]'>
                        <button onClick={() => { handleFilterClick(''); setActiveFilter(''); }}
                            className={`px-5 py-2 ${activeFilter === "" ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                        >ทั้งหมด</button>
                        <button onClick={() => { handleFilterClick('กำลังทำ'); setActiveFilter('1'); }}
                            className={`px-5 py-2 ${activeFilter === "1" ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                        >กำลังทำ</button>
                        <button onClick={() => { handleFilterClick('ตรงเวลา'); setActiveFilter('3'); }}
                            className={`px-5 py-2 ${activeFilter === "3" ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                        >ตรงเวลา</button>
                        <button onClick={() => { handleFilterClick('เลยกำหนด'); setActiveFilter('4'); }}
                            className={`px-5 py-2 ${activeFilter === "4" ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                        >เลยกำหนด</button>
                        <button onClick={() => { handleFilterClick('ยังไม่ได้ส่ง'); setActiveFilter('5'); }}
                            className={`px-5 py-2 ${activeFilter === "5" ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                        >ยังไม่ได้ส่ง</button>
                    </div>
                    <table className='table-auto w-full mt-5'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th>ชั้นปี</th>
                                <th>วิชา</th>
                                <th>บทเรียน</th>
                                <th>จำนวนด่าน</th>
                                <th>แชท</th>
                                <th>จัดเก็บ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.id}</td>
                                    <td>{data.name}</td>
                                    <td>{data.lastname}</td>
                                    <td><p> <span className={`font-bold px-2 whitespace-nowrap 
                                ${data.status === 'ตรงเวลา' ? 'text-green-500 border border-green-500 rounded-md' :
                                            data.status === 'กำลังทำ' ? 'text-gray-500  border border-gray-500 rounded-md' :
                                                data.status === 'เลยกำหนด' ? 'text-red-500 border border-red-500 rounded-md' :
                                                    data.status === 'ยังไม่ได้ส่ง' ? 'text-black border border-black rounded-md' :
                                                        ''
                                        }`}> {data.status}</span></p></td>



                                    <td>
                                        <button
                                            className='text-primary underline decoration-primary'
                                            onClick={() => openModal(data.id)}>แชท</button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => { active('1'); handleViewAnswer(data.id); }}
                                        >
                                            ดูคำตอบ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedId && <ModalChat isOpen={isOpen} onClose={closeModal} userId={selectedId} />}
                    <div className='w-full flex justify-between items-center mt-10 pb-5'>
                        <div className='flex gap-5 items-center'>
                            <div>
                                <p className='w-full'>แสดงจาก 1 จาก {totalPages} หน้า</p>
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
        </div>
    );
}

export default Gethomework