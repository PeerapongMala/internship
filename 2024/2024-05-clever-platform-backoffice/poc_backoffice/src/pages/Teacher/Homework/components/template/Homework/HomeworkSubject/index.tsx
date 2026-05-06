import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Select from 'react-select';

const HomeworkSubject = () => {
    const { subjectId } = useParams();
    const [selectedSubject, setSelectedSubject] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('due');
    const [activeFilter, setActiveFilter] = useState('0');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

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
    const optionsLesson = [
        { value: 'บทที่ 1 จำนวนนับ', label: 'บทที่ 1 จำนวนนับ' },
        { value: '2-col', label: '2 คอลัมน์' },
        { value: '3-col', label: '3 คอลัมน์' },
        { value: '4-col', label: '4 คอลัมน์' },
    ];
    const optionsSubject = [
        { value: 'วิชา', label: 'วิชา' },
        { value: 'math', label: 'คณิตศาสตร์' },
        { value: 'english', label: 'อังกฤษ' },
        { value: 'thai', label: 'ไทย' },
    ];

    const [homeworkData, setHomeworkData] = useState([
        { subjectId: 1, title: 'การบ้านที่ 1', status: 'due', totalCheckpoint: 1 },
        { subjectId: 2, title: 'การบ้านที่ 2', status: 'upcoming', totalCheckpoint: 1 },
        { subjectId: 3, title: 'การบ้านที่ 3', status: 'past', totalCheckpoint: 1 },
        { subjectId: 4, title: 'การบ้านที่ 4', status: 'due', totalCheckpoint: 1 },
        { subjectId: 1, title: 'การบ้านที่ 1', status: 'due', totalCheckpoint: 1 },
        { subjectId: 2, title: 'การบ้านที่ 2', status: 'upcoming', totalCheckpoint: 1 },
        { subjectId: 3, title: 'การบ้านที่ 3', status: 'past', totalCheckpoint: 1 },
        { subjectId: 4, title: 'การบ้านที่ 4', status: 'due', totalCheckpoint: 1 },
    ]);

    const filteredData = homeworkData.filter((homework) => homework.status === filter);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            sendLocalStorageToIframe();
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [selectedSubject]);

    const sendLocalStorageToIframe = () => {
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

    const handleFilterClick = (status: string, index: string) => {
        setFilter(status);
        setActiveFilter(index);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="w-full">
            <div className="flex">
                <p className="text-primary">เกี่ยวกับหลักสูตร</p>
                <p> / การบ้าน</p>
            </div>
            <div className="flex flex-col mt-5 w-full bg-gray-100 px-5 py-5 rounded-md shadow-md">
                <div className="flex">
                    <img src="" alt="" />
                    <h1 className="text-[24px] font-bold">โรงเรียนสาธิตมัธยม</h1>
                </div>
                <div className="mt-3">
                    <p>รหัสโรงเรียน : 000000000001 (ตัวย่อ:AA109)</p>
                </div>
            </div>

            <div className="w-full mt-10 mb-5 flex flex-col gap-3">
                <div className="flex gap-3">
                    <Link to="/teacher/homework">ย้อนกลับ</Link>
                    <h1 className="text-[30px] font-bold">การบ้านวิชา........</h1>
                </div>
                <p>{homeworkData.length} รายการ</p>
            </div>

            <div className="w-full h-auto mt-5 bg-white rounded-xl shadow-md">
                <div className="w-full px-5">
                    <div className="w-full flex flex-col lg:flex-row justify-between py-5">
                        <div className="flex flex-col lg:flex-row items-center gap-5">
                            <select className="px-3 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary">
                                <option value="">Bulk Edit</option>
                                <option value="">10</option>
                                <option value="">15</option>
                                <option value="">20</option>
                            </select>
                            <Link to={'/teacher/addhomework'}>
                                <button className="px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary">สร้างการบ้าน</button>
                            </Link>
                            <div>
                                <input type="text" placeholder="ค้นหา" className="w-full lg:w-[250px] border px-2 py-2 rounded-md" />
                            </div>
                        </div>
                        <div className="mt-3 lg:mt-0 flex justify-center gap-3">
                            <button className="px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary">CSV</button>
                            <button className="px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary">PDF</button>
                        </div>
                    </div>
                    <div className="w-full mt-5 flex flex-col lg:flex-row items-center gap-5">
                        <input type="date" className="form-input" />
                        <input type="date" className="form-input" />
                        <input type="date" className="form-input" />
                        <Select className="w-full " defaultValue={optionsSubject[0]} options={optionsSubject} isSearchable={false} />
                        <Select className="w-full" defaultValue={optionsLesson[0]} options={optionsLesson} isSearchable={false} />
                    </div>

                    <div className="mt-10">
                        <div className="w-full flex border-b-[1px]">
                            <button onClick={() => handleFilterClick('due', '0')} className={`px-5 py-2 ${activeFilter === '0' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>
                                การบ้านที่ต้องส่ง
                            </button>
                            <button onClick={() => handleFilterClick('upcoming', '1')} className={`px-5 py-2 ${activeFilter === '1' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>
                                การบ้านที่สั่งล่วงหน้า
                            </button>
                            <button onClick={() => handleFilterClick('past', '2')} className={`px-5 py-2 ${activeFilter === '2' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>
                                การบ้านที่ผ่านมา
                            </button>
                        </div>
                        <table className="table-auto w-full mt-5">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th>
                                        <div className="flex">
                                            <input type="checkbox" className="form-checkbox" />
                                            <p>ชั้นปี</p>
                                        </div>
                                    </th>
                                    <th>วิชา</th>
                                    <th>บทเรียน</th>
                                    <th>จำนวนด่าน</th>
                                    <th>แก้ไข</th>
                                    <th>จัดเก็บ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((data, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="flex">
                                                <input type="checkbox" className="form-checkbox" />
                                                <p>{data.subjectId}</p>
                                            </div>
                                        </td>
                                        <td>{data.title}</td>
                                        <td>{data.status}</td>
                                        <td>{data.totalCheckpoint}</td>
                                        <td>
                                            <Link to={`/teacher/edithomework/${data.subjectId}`}>
                                                <button>แก้ไข</button>
                                            </Link>
                                        </td>
                                        <td>
                                            <button>จัดเก็บ</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="w-full flex justify-between items-center mt-10 pb-5">
                            <div className="flex gap-5 items-center">
                                <div>
                                    <p className="w-full">
                                        แสดงจาก {indexOfFirstItem + 1} ถึง {indexOfLastItem} ของ {filteredData.length} รายการ
                                    </p>
                                </div>
                                <div>
                                    <select name="" id="" className="form-select w-20">
                                        <option value="10">10</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div className="pagination flex justify-center items-center space-x-2 mt-4">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`size-10 border rounded-full ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-slate-300 text-black'}`}
                                    >
                                        {'<'}
                                    </button>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`size-10 border rounded-full ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-slate-300 text-black'}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`size-10 border rounded-full ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-slate-300 text-black'}`}
                                    >
                                        {'>'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeworkSubject;
