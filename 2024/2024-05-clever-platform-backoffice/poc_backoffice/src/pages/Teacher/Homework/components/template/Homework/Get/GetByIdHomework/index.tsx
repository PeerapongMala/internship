import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import people from '../../people.json';
import ModalChat from '../../../../modal/ModalChat';
import ModalCheckpoint from '../../../../modal/ModalCheckpoint';

const GetByIdHomework = ({ active }: { active: (tab: string) => void }) => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };

    const { id } = useParams();
    const [peopleDataId, setPeopleDataId] = useState(people);

    const filerByid = (id: string) => {
        const filteredData = peopleDataId.filter((person) => person.id === id);
        setPeopleDataId(filteredData);
    };


    useEffect(() => {
        if (id) {
            filerByid(id);
        }
    }, [id]);

    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <div className='full p-5'>

            <div className='w-full mb-5'>
                <div className='w-full bg-gray-100  p-5 mb-5'>
                    <div className='flex gap-5'>
                        <button
                            onClick={() => { active('0'); }}
                        >
                            ย้อนกลับ
                        </button>
                        <h1 className='text-2xl font-bold'>Get By ID Homework</h1>
                    </div>


                    {/* แสดง ID ที่รับมา */}
                    {id}
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

                    <div>
                        <input type="text" placeholder='ค้นหา' className='w-full lg:w-[250px] border px-2 py-2 rounded-md' />
                    </div>
                </div>
                <div className='mt-3 lg:mt-0 flex justify-center gap-3'>
                    <button className='px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary '>CSV</button>
                    <button className='px-5 py-2 bg-primary shadow-md rounded-md text-white font-bold border border-primary '>CSV</button>
                </div>
            </div>

            <div className='w-full mt-5'>
                <table className='table-auto w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th>ชั้นปี</th>
                            <th>วิชา</th>
                            <th>บทเรียน</th>
                            <th>สถานะ</th>
                            <th>ดูคำตอบ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {peopleDataId.map((data, index) => (
                            <tr key={index}>
                                <td>{data.id}</td>
                                <td>{data.tier}</td>
                                <td>{data.date}</td>
                                <td><p> <span className={`font-bold px-2 whitespace-nowrap 
                                ${data.status === 'ตรงเวลา' ? 'text-green-500 border border-green-500 rounded-md' :
                                        data.status === 'กำลังทำ' ? 'text-gray-500  border border-gray-500 rounded-md' :
                                            data.status === 'เลยกำหนด' ? 'text-red-500 border border-red-500 rounded-md' :
                                                data.status === 'ยังไม่ได้ส่ง' ? 'text-black border border-black rounded-md' :
                                                    ''
                                    }`}> {data.status}</span></p></td>

                                
                                <td>
                                    <button onClick={handleShowModal}>ดูคำตอบ</button>
                                    <ModalCheckpoint
                                        open={showModal}
                                        onClose={handleCloseModal}
                                        subjectId={data.id}
                                    />

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default GetByIdHomework