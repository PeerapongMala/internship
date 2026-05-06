import IconExport from '@/components/Icon/IconExport';
import IconArrowBack from '@/components/Icon/IconArrowBack';
import IconImport from '@/components/Icon/IconImport';
import TableManageGroup from './components/tableManageGroup';
import TabsMenu from './components/tabsMenu';
import { DataItem, Tab } from './interfaces/interface';

const ManageGroup = () => {
    const tabs: Tab[] = [
        { id: 'info', label: 'ข้อมูลกลุ่มเรียน' },
        { id: 'members', label: 'สมาชิก' },
        { id: 'overview', label: 'ภาพรวม' },
        { id: 'summary', label: 'สรุปคะแนน' },
        { id: 'statistics', label: 'สถิติการเล่นนักเรียน' },
        { id: 'notes', label: 'บทเรียน' },
        { id: 'research', label: 'วิจัยในชั้นเรียน' },
    ];

    const tabsTable = [
        { id: 'overview', label: 'ภาพรวม' },
        { id: 'difficulty_discrimination_reliability', label: 'ค่าความยากง่าย อำนาจจำแนก ค่าความเชื่อมั่น' },
    ];

    const data: DataItem[] = [
        { id: '1', values: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 13, 169] },
        { id: 'Σ', values: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 13, 169], colorHex: '#F5F5F5' },
        { id: 'กลุ่มเก่าตอบถูก (H)', values: Array(15).fill(0), colorHex: '#FFFFF1' },
        { id: 'กลุ่มอ่อนตอบถูก (L)', values: Array(15).fill(0), colorHex: '#FFFFF1' },
        { id: 'ค่าความยาก (P)', values: Array(15).fill('NaN'), colorHex: '#F5F5FD' },
        { values: Array(15).fill('เข้าเกณฑ์ข้อสอบยากมาก 0.0-0.2'), colorHex: '#F5F5FD' },
        { id: 'ค่าจำนวนจำแนก (B-index)', values: Array(15).fill('NaN'), colorHex: '#F9FFF7' },
    ];

    const dataMaxLength: number = Math.max(...data.map((item) => (item.values ? item.values.length : 0)));

    return (
        <div className="w-full h-ful flex flex-col p-5 gap-5">
            <div className="flex flex-col gap-[23px] mb-5">
                <div>
                    <a href="#" className="text-primary text-sm">
                        โรงเรียนสาราธิการพิทยาลัย
                    </a>
                    <span className="text-primary text-sm"> / </span>
                    <a href="#" className="text-primary text-sm">
                        การเรียนการสอน
                    </a>
                    <span className="text-primary text-sm"> / </span>
                    <a href="#" className="text-primary text-sm">
                        กลุ่มเรียนทั้งหมด
                    </a>
                    <span className="text-primary text-sm"> / </span>
                    <span className="text-black text-sm">00000000001: CLEVER GROUP</span>
                </div>
                <div>
                    <div className="flex flex-row items-center text-center justify-start gap-[10px]">
                        <IconArrowBack />
                        <p className="text-2xl font-bold">กลุ่มเรียน</p>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col bg-neutral-100 p-3 gap-3 rounded-md">
                        <div className="flex gap-[10px]">
                            <p className="text-xl font-bold text-neutral-900">CLEVER GROUP (10)</p>
                        </div>
                        <p className="text-sm font-normal">ปีการศึกษา: 2567 / ป.4 / ห้อง 1</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-start bg-white border-b border-neutral-200">
                <TabsMenu tabs={tabs} />
            </div>
            <main>
                <section className="w-full h-full flex flex-col p-5 gap-5 bg-white rounded-md">
                    <div className="w-full flex justify-end space-x-[10px]">
                        <button type="button" className="btn btn-primary">
                            <IconImport className=" pr-1 " />
                            <p className="text-sm ">CSV</p>
                        </button>
                        <button type="button" className="btn btn-primary">
                            <IconExport className="pr-1" />
                            <p className="text-sm ">CSV</p>
                        </button>
                    </div>

                    <div className="flex justify-start bg-white border-b border-neutral-200">
                        <TabsMenu tabs={tabsTable} />
                    </div>
                    <div className="overflow-x-auto rounded-md">
                        {/* Data Table */}
                        <TableManageGroup data={data} dataMaxLength={dataMaxLength} />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ManageGroup;
