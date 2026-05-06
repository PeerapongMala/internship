import { cn } from '@/utils/cn';
import { useRef, useState } from 'react';
import Box from '../Lesson/components/atoms/Box';
import IconUpload from '@/components/Icon/IconUpload';
import IconDownloadOutline from '@/components/Icon/IconDownloadOutline';
import Flatpickr from 'react-flatpickr';
import IconDoubleArrowLeft from '@/components/Icon/IconDoubleArrowLeft';
import IconAltArrowLeft from '@/components/Icon/IconAltArrowRight';
import IconDoubleArrowRight from '@/components/Icon/IconDoubleArrowRight';
import IconAltArrowRight from '@/components/Icon/IconAltArrowLeft';
import Breadcrumb, { BreadcrumbItem } from './components/Breadcrumb';
import SchoolCard from './components/SchoolCard';
import Tabs from './components/Tabs';

function GradeManagement() {
    const fp = useRef(null);
    const [tabIndex, setTabIndex] = useState(3);

    const breadcrumbItems: BreadcrumbItem[] = [
        {
            text: 'การเรียนการสอน',
            href: '#',
        },
        {
            text: 'ระบบตัดเกรด (ปพ.)',
            href: '#',
        },
        {
            text: 'ระบบตัดเกรด (ปพ.)',
        },
    ];

    const tabItems = ['ปพ.6', 'เล่มปพ.6', 'ใบรับรอง', 'คะแนนรายชั้น', 'เกรดรายชั้น', 'เกรดร้อยละ'];
    const tableItems = Array.from({ length: 24 }, (_, i) => ({
        no: i + 1,
        name: 'Kristin Watson',
        percentage: (Math.random() * (20 - 1) + 1).toFixed(1),
        rank: Math.floor(Math.random() * 10) + 1,
    }));

    const now = new Date();
    const nextDate = new Date();
    nextDate.setDate(now.getDate() + 1);
    const range = [now, nextDate];

    return (
        <div className="w-full">
            <div className="flex flex-col gap-6">
                <Breadcrumb items={breadcrumbItems} />
                <SchoolCard />
                <p className=" text-2xl font-semibold">ระบบตัดเกรด (ปพ.6)</p>
                <Tabs items={tabItems} currentIndex={tabIndex} onClick={(index) => setTabIndex(index)} />
            </div>
            <Box className="flex flex-col gap-5 mt-[20px]">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <button type="button" className="btn btn-primary">
                            <IconUpload className="pr-1" />
                            CSV
                        </button>
                        <button type="button" className="btn btn-primary">
                            <IconDownloadOutline className="pr-1" />
                            CSV
                        </button>
                    </div>
                    <div className="group relative">
                        <input type="text" placeholder="ค้นหา" className="peer form-input ltr:pr-8 rtl:pl-8" />
                        <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                                <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="group relative">
                        <Flatpickr color="#4361EE" className="w-64 h-[38px] border rounded-md overflow-hidden border-neutral-200 p-3" value={range} options={{ mode: 'range' }} />
                        <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                                <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                    <select className="form-select w-64">
                        <option selected value="2567">
                            ปีการศึกษา 2567
                        </option>
                        <option value="2566">ปีการศึกษา 2566</option>
                        <option value="2565">ปีการศึกษา 2565</option>
                    </select>
                    <select className="form-select w-64">
                        <option selected value="1">
                            ประถมศึกษาปีที่ 1
                        </option>
                        <option value="2">ประถมศึกษาปีที่ 2</option>
                        <option value="3">ประถมศึกษาปีที่ 3</option>
                    </select>
                    <select className="form-select w-64">
                        <option selected value="1">
                            ห้อง 1
                        </option>
                        <option value="2">ห้อง 2</option>
                        <option value="3">ห้อง 3</option>
                    </select>
                </div>
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="border border-neutral-400 text-sm font-bold text-center w-28">เลขที่</th>
                            <th className="border border-neutral-400 text-sm font-bold text-center">ชื่อสกุล</th>
                            <th className="border border-neutral-400 text-sm font-bold text-center clear-padding">
                                <th className="flex justify-center border-b border-neutral-400 text-sm font-bold text-center">คะแนนผลการเรียน</th>
                                <div className="flex justify-evenly border-neutral-400">
                                    <div className="flex flex-1 flex-col justify-end text-sm font-bold text-start border-r border-neutral-400">
                                        <th className="flex items-center [writing-mode:vertical-lr] border-t border-neutral-400 -rotate-180 clear-padding">
                                            <p className="text-sm font-bold h-28 truncate">ภาษาไทย</p>
                                        </th>
                                        <th className="text-sm font-bold text-center clear-padding text-primary">##</th>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-end text-sm font-bold text-start border-r border-neutral-400">
                                        <th className="flex items-center [writing-mode:vertical-lr] border-t border-neutral-400 -rotate-180 clear-padding">
                                            <p className="text-sm font-bold h-28 truncate">คณิตศาสตร์</p>
                                        </th>
                                        <th className="text-sm font-bold text-center clear-padding text-primary">##</th>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-end text-sm font-bold text-start border-r border-neutral-400">
                                        <th className="flex items-center [writing-mode:vertical-lr] border-t border-neutral-400 -rotate-180 clear-padding">
                                            <p className="text-sm font-bold h-28 truncate">วิทยาศาสตร์และเทคโนโลยี</p>
                                        </th>
                                        <th className="text-sm font-bold text-center clear-padding text-primary">##</th>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-end text-sm font-bold text-start border-r border-neutral-400">
                                        <th className="flex items-center [writing-mode:vertical-lr] border-t border-neutral-400 -rotate-180 clear-padding">
                                            <p className="text-sm font-bold h-28 truncate">สังคมศึกษา ศาสนาและวัฒนธรรม</p>
                                        </th>
                                        <th className="text-sm font-bold text-center clear-padding text-primary">##</th>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-end text-sm font-bold text-start border-r border-neutral-400">
                                        <th className="flex items-center [writing-mode:vertical-lr] border-t border-neutral-400 -rotate-180 clear-padding">
                                            <p className="text-sm font-bold h-28 truncate">ประวัติศาสตร์</p>
                                        </th>
                                        <th className="text-sm font-bold text-center clear-padding text-primary">##</th>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-end text-sm font-bold text-start border-r border-neutral-400">
                                        <th className="flex items-center [writing-mode:vertical-lr] border-t border-neutral-400 -rotate-180 clear-padding">
                                            <p className="text-sm font-bold h-28 truncate">ศิลปะ</p>
                                        </th>
                                        <th className="text-sm font-bold text-center clear-padding text-primary">##</th>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-end text-sm font-bold text-start border-r border-neutral-400">
                                        <th className="flex items-center [writing-mode:vertical-lr] border-t border-neutral-400 -rotate-180 clear-padding">
                                            <p className="text-sm font-bold h-28 truncate">การงานอาชีพ</p>
                                        </th>
                                        <th className="text-sm font-bold text-center clear-padding text-primary">##</th>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-end text-sm font-bold text-start border-r border-neutral-400">
                                        <th className="flex items-center [writing-mode:vertical-lr] border-t border-neutral-400 -rotate-180 clear-padding">
                                            <p className="text-sm font-bold h-28 truncate">ภาษาอังกฤษ</p>
                                        </th>
                                        <th className="text-sm font-bold text-center clear-padding text-primary">##</th>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-end text-sm font-bold text-start border-r border-neutral-400">
                                        <th className="flex items-center [writing-mode:vertical-lr] border-t border-neutral-400 -rotate-180 clear-padding">
                                            <p className="text-sm font-bold h-28 truncate"> ภาษาอังกฤษเพื่อการสื่อสาร(เพิ่มเติม)</p>
                                        </th>
                                        <th className="text-center clear-padding text-primary">##</th>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-end text-sm font-bold text-start min-w-24">
                                        <th className="h-full flex items-center justify-center text-sm font-bold text-center border-b border-neutral-400">รวม</th>
                                        <th className="text-sm font-bold text-center clear-padding">100</th>
                                    </div>
                                </div>
                            </th>
                            <th className="border border-neutral-400 text-sm font-bold text-center">ร้อยละ</th>
                            <th className="border border-neutral-400 text-sm font-bold text-center">ลำดับที่คะแนนรวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableItems.map((i, index) => {
                            return (
                                <tr className={cn('h-8', (index + 1) % 2 === 0 && 'bg-neutral-100')}>
                                    <td className="border border-neutral-400 clear-padding text-center text-sm">{i.no}</td>
                                    <td className="border border-neutral-400 clear-padding text-center text-sm">{i.name}</td>
                                    <td className="border border-neutral-400 clear-padding">
                                        <div className="flex justify-evenly border-neutral-400">
                                            <div className="flex flex-1 flex-col justify-end text-start border-r border-neutral-400">
                                                <td className="flex justify-center items-center text-center clear-padding h-8 text-sm">0</td>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-end text-start border-r border-neutral-400">
                                                <td className="flex justify-center items-center text-center clear-padding h-8 text-sm">0</td>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-end text-start border-r border-neutral-400">
                                                <td className="flex justify-center items-center text-center clear-padding h-8 text-sm">0</td>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-end text-start border-r border-neutral-400">
                                                <td className="flex justify-center items-center text-center clear-padding h-8 text-sm">0</td>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-end text-start border-r border-neutral-400">
                                                <td className="flex justify-center items-center text-center clear-padding h-8 text-sm">0</td>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-end text-start border-r border-neutral-400">
                                                <td className="flex justify-center items-center text-center clear-padding h-8 text-sm">0</td>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-end text-start border-r border-neutral-400">
                                                <td className="flex justify-center items-center text-center clear-padding h-8 text-sm">0</td>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-end text-start border-r border-neutral-400">
                                                <td className="flex justify-center items-center text-center clear-padding h-8 text-sm">0</td>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-end text-start border-r border-neutral-400">
                                                <td className="flex justify-center items-center text-center clear-padding h-8 text-sm">0</td>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-end text-start min-w-24">
                                                <td className="flex justify-center items-center text-center clear-padding h-8 text-sm text-primary">90</td>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border border-neutral-400 clear-padding text-center text-sm text-primary">{i.percentage}</td>
                                    <td className="border border-neutral-400 clear-padding text-center text-sm text-primary">{i.rank}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <p>แสดงท 1 จาก 12 หน้า</p>
                        <select className="form-select w-16">
                            <option selected value="10">
                                10
                            </option>
                            <option value="20">20</option>
                            <option value="3">30</option>
                        </select>
                    </div>
                    <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse">
                        <li>
                            <button
                                type="button"
                                className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                            >
                                <IconDoubleArrowLeft />
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                            >
                                <IconAltArrowLeft />
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="flex justify-center font-semibold px-3.5 py-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                            >
                                1
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center font-semibold px-3.5 py-2 rounded-full transition bg-primary text-white dark:text-white-light dark:bg-primary">
                                2
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="flex justify-center font-semibold px-3.5 py-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                            >
                                3
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                            >
                                <IconAltArrowRight />
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                            >
                                <IconDoubleArrowRight />
                            </button>
                        </li>
                    </ul>
                </div>
            </Box>
        </div>
    );
}

export default GradeManagement;
