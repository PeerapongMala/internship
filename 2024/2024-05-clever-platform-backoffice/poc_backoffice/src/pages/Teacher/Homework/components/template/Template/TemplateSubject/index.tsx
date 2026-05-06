import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Select from 'react-select';

const HomeworkSubject = () => {
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

    const datatables = [
        {
            subjectId: '001',
            title: 'บทที่ 1 จำนวนนับ',
            checkpoint: 1,
            type: 'แบบฝึกหัด',
            question: 'ปรนัยแบบเลือกตอบ',
            tier: 'ง่าย',
            reward: 1,
            status: 'ใช้งาน',
            updatenow: new Date().toISOString(),
            updateon: 'Admin GM',
        },
        {
            subjectId: '002',
            title: 'บทที่ 1 จำนวนนับ',
            checkpoint: 1,
            type: 'แบบฝึกหัด',
            question: 'ปรนัยแบบเลือกตอบ',
            tier: 'ปานกลาง',
            reward: 1,
            status: 'ใช้งาน',
            updatenow: new Date().toISOString(),
            updateon: 'Admin GM',
        },
        {
            subjectId: '003',
            title: 'บทที่ 1 จำนวนนับ',
            checkpoint: 1,
            type: 'แบบฝึกหัด',
            question: 'ปรนัยแบบเลือกตอบ',
            tier: 'ยาก',
            reward: 1,
            status: 'ใช้งาน',
            updatenow: new Date().toISOString(),
            updateon: 'Admin GM',
        },
        {
            subjectId: '004',
            title: 'บทที่ 1 จำนวนนับ',
            checkpoint: 1,
            type: 'แบบฝึกหัด',
            question: 'ปรนัยแบบเลือกตอบ',
            tier: 'ง่าย',
            reward: 1,
            status: 'ไม่ใช้งาน',
            updatenow: new Date().toISOString(),
            updateon: 'Admin GM',
        },
    ];
    const { subjectId } = useParams();
    const [selectedSubject, setSelectedSubject] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
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
    const [activeFilter, setActiveFilter] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filter, setFilter] = useState('');

    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const totalPages = Math.ceil(datatables.length / itemsPerPage);
    const handleFilterClick = (status: string) => {
        setFilter(status);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };
    const filteredData = filter ? datatables.filter((homework) => homework.status === filter) : datatables;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="w-full">
            <div className="flex">
                <p className="text-primary">เกี่ยวกับหลักสูตร</p>
                <p> / การบ้าน</p>
            </div>
            <div className="flex flex-col mt-5 w-full bg-gray-100 px-2 py-3 rounded-md shadow-md">
                <div className="flex">
                    <img src="" alt="" />
                    <h1 className="text-[24px] font-bold">โรงเรียนสาธิตมัธยม</h1>
                </div>
                <div className="mt-3">
                    <p>รหัสโรงเรียน : 000000000001 (ตัวย่อ:AA109)</p>
                </div>
            </div>

            <div className="w-full my-10 flex flex-col gap-3">
                <div className="flex">
                    <Link to="/teacher/template">ย้อนกลับ</Link>
                    <h1 className="text-[30px] font-bold">ข้อมูลการบ้าน.........</h1>
                </div>
                <p>{datatables.length} รายการ</p>
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
                            <button className="px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary " onClick={openModal}>
                                สร้างการบ้าน
                            </button>

                            <div>
                                <input type="text" placeholder="ค้นหา" className="w-full lg:w-[250px] border px-2 py-2 rounded-md" />
                            </div>
                        </div>
                        <div className="mt-3 lg:mt-0 flex justify-center gap-3">
                            <button className="px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary ">CSV</button>
                            <button className="px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary ">CSV</button>
                        </div>
                    </div>
                    <div className="w-full mt-5 flex flex-col lg:flex-row items-center gap-5">
                        <Select className="w-full lg:w-[300px]" defaultValue={optionsSubject[0]} options={optionsSubject} isSearchable={false} />
                        <Select className="w-full lg:w-[300px]" defaultValue={optionsLesson[0]} options={optionsLesson} isSearchable={false} />
                        <Select className="w-full lg:w-[300px]" defaultValue={optionsMiniLesson[0]} options={optionsMiniLesson} isSearchable={false} />
                    </div>

                    <div className="mt-8">
                        <div className="w-full flex border-b-[1px]">
                            <button
                                onClick={() => {
                                    handleFilterClick('');
                                    setActiveFilter('');
                                }}
                                className={`px-5 py-2 ${activeFilter === '' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                            >
                                ทั้งหมด
                            </button>
                            <button
                                onClick={() => {
                                    handleFilterClick('ใช้งาน');
                                    setActiveFilter('1');
                                }}
                                className={`px-5 py-2 ${activeFilter === '1' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                            >
                                ใช้งาน
                            </button>
                            <button
                                onClick={() => {
                                    handleFilterClick('ไม่ใช้งาน');
                                    setActiveFilter('2');
                                }}
                                className={`px-5 py-2 ${activeFilter === '2' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                            >
                                ไม่ใช้งาน
                            </button>
                        </div>
                        <table className="table-auto w-full mt-5">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th>ชั้นปี</th>
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
                                        <td>{data.subjectId}</td>
                                        <td>{data.title}</td>
                                        <td>{data.checkpoint}</td>
                                        <td>{data.type}</td>
                                        <td>
                                            <Link to={`/teacher/edittemplate/${data.subjectId}`}>
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
                                    <p className="w-full">แสดงจาก 1 จาก 12 หน้า</p>
                                </div>
                                <div>
                                    <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="form-select w-20">
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
                                        className={`size-10 border rounded-full ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-slate-300 text-black'}`}
                                    >
                                        {'<'}
                                    </button>

                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`size-10 border rounded-full ${
                                                currentPage === index + 1 ? 'bg-primary text-white' : 'bg-slate-300 text-black'
                                            } hover:bg-blue-500 hover:text-white transition`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    {/* necxt */}
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
