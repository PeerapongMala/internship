import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import ModalQuestion from '../../../modal/ModalQuestion';
import API from '../../../../api/index';
import { Subject } from '../../../../type';

const EditTemplate = () => {
    const { subjectId } = useParams();
    const [dataSubject, setDataSubject] = useState<Subject>();
    console.log(dataSubject);

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
    const byAdmin = 'Admin GM';
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="w-full">
            <div className="w-full py-3">
                <p className="text-primary">
                    เกี่ยวกับหลักสูตร / <span className="text-black">การบ้าน</span>
                </p>
            </div>
            <div className="flex items-center gap-3 my-5">
                <button onClick={handleBack} className="">
                    ย้อนกลับ
                </button>
                <h1 className="text-[24px] font-bold">สร้างการบ้าน</h1>
            </div>
            <div className="w-full mt-5 flex gap-5">
                {/* Tabs */}
                <div className="w-[75%]">
                    {/* Content */}
                    <div className="w-full">
                        <SelectLesson />
                    </div>
                </div>

                <div className="w-[25%] max-h-[250px] shadow-lg bg-white rounded-lg p-3">
                    <div className="flex items-center mb-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">รหัส</label>
                        <p className="w-full">{subjectId}</p>
                    </div>
                    <div className="flex items-center mb-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">สถานะ</label>
                        <select className="border w-full rounded-lg py-2">
                            <option value="">ใช้งาน</option>
                            <option value="">ไม่ใช้งาน</option>
                        </select>
                    </div>
                    <div className="flex items-center mb-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">แก้ไขล่าสุด</label>
                        <p className="w-full">{time}</p>
                    </div>
                    <div className="flex items-center mb-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">แก้ไขโดย</label>
                        <p className="w-full">{byAdmin}</p>
                    </div>
                    <div className="mt-5">
                        <button className="w-full bg-primary py-2 text-white font-bold shadow-md rounded-md" onClick={() => alert('Click')}>
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
                <div className="mt-5 mb-10">
                    <h1 className="text-[24px] font-bold">ข้อมูลการบ้าน</h1>
                </div>

                <div className="flex gap-5 mt-5">
                    <div className="w-full">
                        <label htmlFor="">
                            <span className="text-red-500">*</span>วิชา
                        </label>
                        <input type="text" className="w-full border rounded-lg px-5 py-1.5" />
                    </div>
                    <div className="w-full">
                        <label htmlFor="">
                            <span className="text-red-500">*</span>ชั้นปี
                        </label>
                        <select className="w-full border rounded-lg px-3 py-1.5">
                            <option value="">ปี 4 </option>
                            <option value=""></option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="w-full bg-white mt-10 p-5">
                <h1 className="text-[24px] font-bold py-5">บทเรียนหลัก</h1>
                <select className="w-[30%] border rounded-lg px-3 py-1.5">
                    <option value="">บทที่ 1 จำนวนนับ</option>
                    <option value=""></option>
                </select>

                <div className="w-full">
                    <h1 className="text-[24px] font-bold py-5">บทเรียนหลักย่อย</h1>

                    {/* Accordion 1 */}
                    <div className="w-full px-2 mb-5">
                        <div className="flex justify-between items-center bg-gray-100 pr-4">
                            <button onClick={() => toggleAccordion(0)} className="bg-gray-100 px-4 py-2">
                                {openAccordions[0] ? (
                                    <span className="mr-2">▼</span> // ลูกศรชี้ลง
                                ) : (
                                    <span className="mr-2">▲</span> // ลูกศรชี้ขึ้น
                                )}
                                จำนวนนับและสมบัติของจำนวนนับ 1
                            </button>
                            <p>ด่าน 2</p>
                        </div>
                        {openAccordions[0] && (
                            <div className="p-4 bg-gray-50 mt-3">
                                <div>
                                    <p className="w-full bg-emerald-300 py-0.5 px-0.5">ง่าย</p>
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
                                    <p className="w-full bg-yellow-300 py-0.5 px-0.5">ปานกลาง</p>
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
                                    <p className="w-full bg-red-300 py-0.5 px-0.5">ยาก</p>
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
                        {selectedId && <ModalQuestion open={isOpen} onClose={closeModal} subjectId={selectedId.toString()} />}
                    </div>

                    {/* Accordion 2 */}
                    <div className="w-full px-2 mb-5">
                        <div className="flex justify-between items-center bg-gray-100 pr-4">
                            <button onClick={() => toggleAccordion(1)} className="bg-gray-100 px-4 py-2">
                                {openAccordions[1] ? <span className="mr-2">▼</span> : <span className="mr-2">▲</span>}
                                จำนวนนับและสมบัติของจำนวนนับ 2
                            </button>
                            <p>ด่าน 2</p>
                        </div>
                        {openAccordions[1] && (
                            <div className="p-4 bg-gray-50 mt-3">
                                <div>
                                    <p className="w-full bg-emerald-300 py-0.5 px-0.5">ง่าย</p>
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
                                    <p className="w-full bg-yellow-300 py-0.5 px-0.5">ปานกลาง</p>
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
                                    <p className="w-full bg-red-300 py-0.5 px-0.5">ยาก</p>
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
                    <div className="w-full px-2 mb-5">
                        <div className="flex justify-between items-center bg-gray-100 pr-4">
                            <button onClick={() => toggleAccordion(2)} className="bg-gray-100 px-4 py-2">
                                {openAccordions[2] ? <span className="mr-2">▼</span> : <span className="mr-2">▲</span>}
                                การบวก ลบ คูณ หารระคน
                            </button>
                            <p>ด่าน 2</p>
                        </div>
                        {openAccordions[2] && (
                            <div className="p-4 bg-gray-200 mt-3 ">
                                <p>ง่าย</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
const SelectItem = () => {
    return <div>SelectItem</div>;
};

export default EditTemplate;
