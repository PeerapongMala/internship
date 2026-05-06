import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Checkbox from '../../../web/homework/organisms/Checkbox';
import SidePanel from '../../../web/homework/organisms/Sidepanel';
import API from '../../../../api';
import { Subject } from '../../../../type';

const AddHomework = () => {
    const { subjectId } = useParams();
    const [dataSubject, setDataSubject] = useState<Subject[]>();
    console.log(dataSubject);

    // useEffect(() => {
    //     API.Subject.SubjectAll.Get()
    //         .then((res) => {
    //             return res.json();
    //         })
    //         .then((data) => {
    //             setDataSubject(data);
    //         })
    //         .catch((err) => console.error(err));

    // }, [])

    let time = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    const byAdmin = 'Admin GM';
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };

    const [isExpanded, setIsExpanded] = useState(false);

    const handleCheckboxChange = () => {
        setIsExpanded(!isExpanded);
    };
    const handleSaveClick = () => {
        alert('บันทึกข้อมูลการบ้าน');
    };
    const checkboxOptions = [
        {
            title: 'ป4/1',
            subGroups: ['ป4/1 กลุ่มเรียน 1', 'ป4/1 กลุ่มเรียน 2', 'ป4/1 กลุ่มเรียน 3', 'ป4/1 กลุ่มเรียน 4'],
        },
        {
            title: 'ป4/2',
            subGroups: ['ป4/2 กลุ่มเรียน 1', 'ป4/2 กลุ่มเรียน 2', 'ป4/2 กลุ่มเรียน 3', 'ป4/2 กลุ่มเรียน 4'],
        },
        {
            title: 'ป4/3',
            subGroups: ['ป4/3 กลุ่มเรียน 1', 'ป4/3 กลุ่มเรียน 2', 'ป4/3 กลุ่มเรียน 3', 'ป4/3 กลุ่มเรียน 4'],
        },
        {
            title: 'ป4/4',
            subGroups: ['ป4/4 กลุ่มเรียน 1', 'ป4/4 กลุ่มเรียน 2', 'ป4/4 กลุ่มเรียน 3', 'ป4/4 กลุ่มเรียน 4'],
        },
    ];
    interface SubGroup {
        title: string;
        subGroups: string[];
    }
    const grade4Options: SubGroup[] = [
        { title: 'ป4/1', subGroups: ['ป4/1 กลุ่มเรียน 1', 'ป4/1 กลุ่มเรียน 2', 'ป4/1 กลุ่มเรียน 3'] },
        { title: 'ป4/2', subGroups: ['ป4/2 กลุ่มเรียน 1', 'ป4/2 กลุ่มเรียน 2'] },
    ];

    const grade5Options: SubGroup[] = [
        { title: 'ป5/1', subGroups: ['ป5/1 กลุ่มเรียน 1', 'ป5/1 กลุ่มเรียน 2'] },
        { title: 'ป5/2', subGroups: ['ป5/2 กลุ่มเรียน 1'] },
    ];

    const grade6Options: SubGroup[] = [
        { title: 'ป6/1', subGroups: ['ป6/1 กลุ่มเรียน 1', 'ป6/1 กลุ่มเรียน 2'] },
        { title: 'ป6/2', subGroups: ['ป6/2 กลุ่มเรียน 1'] },
    ];
    return (
        <div className="w-full">
            <div>
                <p className="text-primary">
                    เกี่ยวกับหลักสูตร / <span>การบ้าน</span>
                </p>

                <div className="flex items-center gap-5 my-8">
                    <Link to={'/teacher/homework'}>ย้อนกลับ</Link>
                    <button onClick={handleBack} className="">
                        ย้อนกลับ
                    </button>
                    <h1 className="text-[24px] font-bold">สร้างการบ้าน</h1>
                </div>
            </div>
            <div className="w-full flex gap-10">
                <div className="w-[75%]">
                    <div className="bg-white shadow-sm p-5">
                        <h1 className="text-[24px] font-bold">ข้อมูลการบ้าน</h1>
                        <div className="grid grid-cols-3 gap-8 mt-5">
                            <div className="w-full col-span-1">
                                <label htmlFor="">
                                    <span className="text-red-500">*</span>วิชา
                                </label>
                                <input type="text" className="form-input" placeholder="คณิตศาสตร์" />
                            </div>
                            <div className="w-full col-span-1">
                                <label htmlFor="">
                                    <span className="text-red-500">*</span>ชั้นปี:
                                </label>
                                <select name="" id="" className="form-select">
                                    <option value="">ป.4</option>
                                    <option value=""></option>
                                </select>
                            </div>
                            <div className="w-full col-span-1">
                                <label htmlFor="">
                                    <span className="text-red-500">*</span>เลือกการบ้าน:
                                </label>
                                <select name="" id="" className="form-select">
                                    <option value="">การบ้าน ป.4 บทที่ 1</option>
                                    <option value=""></option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-end gap-8 mt-2">
                            <div className="w-full col-span-1">
                                <label htmlFor="">
                                    <span className="text-red-500">*</span>วันที่เริ่ม
                                </label>
                                <input type="date" className="form-input" />
                            </div>
                            <div className="w-full col-span-1">
                                <input type="time" className="form-input" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-end gap-8 mt-2">
                            <div className="w-full col-span-1">
                                <label htmlFor="">
                                    <span className="text-red-500">*</span>กำหนดส่ง
                                </label>
                                <input type="date" className="form-input" />
                            </div>
                            <div className="w-full col-span-1">
                                <input type="time" className="form-input" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-end gap-8 mt-2">
                            <div className="w-full col-span-1">
                                <label htmlFor="">
                                    <span className="text-red-500">*</span>วันที่ปิดรับ
                                </label>
                                <input type="date" className="form-input" />
                            </div>
                            <div className="w-full col-span-1">
                                <input type="time" className="form-input" />
                            </div>
                            <div className="col-span-1 flex items-center">
                                <input type="checkbox" className="form-checkbox" />
                                <label htmlFor="" className="mt-1">
                                    เหมือนวันกำหนดส่ง
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white mt-5 shadow-sm p-5">
                        <h1 className="text-[24px] font-bold">มอบหมายให้</h1>
                        <div className="p-4">
                            {/* Checkbox */}
                            <Checkbox title="ป4" options={grade4Options} />
                            <hr />
                            <Checkbox title="ป5" options={grade5Options} />
                            <hr />
                            <Checkbox title="ป6" options={grade6Options} />
                        </div>
                    </div>
                </div>

                <SidePanel time={time} byAdmin={byAdmin} onClick={handleSaveClick} />
                {/* <div className='w-[25%] max-h-[250px] bg-white rounded-lg p-3 shadow-md'>
                    <div className='flex items-center mb-3'>
                        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">รหัส</label>
                        <p className="w-full">{subjectId}</p>
                    </div>
                    <div className='flex items-center mb-3'>
                        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">สถานะ</label>
                        <select className='border w-full rounded-lg py-2'>
                            <option value="">ใช้งาน</option>
                            <option value="">ไม่ใช้งาน</option>
                        </select>
                    </div>
                    <div className='flex items-center mb-3'>
                        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">แก้ไขล่าสุด</label>
                        <p className="w-full">{time}</p>
                    </div>
                    <div className='flex items-center mb-3'>
                        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">แก้ไขโดย</label>
                        <p className="w-full">{byAdmin}</p>
                    </div>
                    <div className='mt-5'>
                        <button className='w-full bg-primary py-2 text-white font-bold shadow-2xl rounded-md' onClick={() => alert("Click")}>บันทึก</button>
                    </div>


                </div> */}
            </div>
        </div>
    );
};

export default AddHomework;
