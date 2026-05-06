import { useState } from 'react'
import { Link } from 'react-router-dom'

const Template = () => {
    const datatables = [
        {
            subjectId: "001",
            title: "กระทรวงศึกษาธิการ",
            subjectname: "คณิตศาสตร์",
            type: "แบบฝึกหัด",

        },
        {
            subjectId: "002",
            title: "กระทรวงศึกษาธิการ",
            subjectname: "คณิตศาสตร์",
            type: "แบบฝึกหัด",


        },
        {
            subjectId: "003",
            title: "กระทรวงศึกษาธิการ",
            subjectname: "คณิตศาสตร์",
            type: "แบบฝึกหัด",


        },
        {
            subjectId: "004",
            title: "กระทรวงศึกษาธิการ",
            subjectname: "คณิตศาสตร์",
            type: "แบบฝึกหัด",

        },
    ]

    let counter = 1;

    return (
        <div className='w-full'>
            <div className='flex'>
                <p className='text-primary'>เกี่ยวกับหลักสูตร</p>
                <p>  / การบ้าน</p>
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
                <div className='my-10'>
                    <h1 className='font-bold text-[28px]'>Template การบ้าน</h1>
                </div>

                <div>
                    <div className='w-full h-auto mt-5 bg-white rounded-xl shadow-md'>
                        <div className='w-full px-5 pt-5'>
                            <table className='table-auto w-full '>
                                <thead className='bg-gray-100'>
                                    <tr>
                                        <th>#ID</th>
                                        <th>รหัสวิชา</th>
                                        <th>สังกัดวิชา</th>
                                        <th>วิชา</th>
                                        <th>ดูการบ้าน</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {datatables.map((data, index) => (
                                        <tr key={index}>
                                            <td>{String(counter++).padStart(3, '0')}</td>
                                            <td>{data.subjectId}</td>
                                            <td>{data.title}</td>
                                            <td>{data.subjectname}</td>
                                            <td><Link to={`/teacher/template/${data.subjectId}`}><button>แก้ไข</button></Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Template