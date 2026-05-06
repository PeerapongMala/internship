import { ReactNode } from 'react';
import type { DataTableColumn } from "mantine-datatable";
// import react-textarea-autosize
import TextareaAutosize from 'react-textarea-autosize';
import IconVolumeLoud from '../../../components/Icon/IconVolumeLoud';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconPlus from '../../../components/Icon/IconPlus';

interface RowData {
    id: number;
    answer?: string;
    topic?: string;
    language_th: string;
    language_th_ai?: string;
    language_th_sound?: string;
    language_en: string;
    language_en_ai?: string;
    language_en_sound?: string;
    language_cn: string;
    language_cn_ai?: string;
    language_cn_sound?: string;
    [key: string]: unknown;
}

const rowData: RowData[] = [
    {
        id: 1,
        topic: 'Command',
        language_th: 'จงเลือกคำตอบที่ถูกต้อง',
        language_th_ai: 'จงเลือกคำตอบที่ถูกต้อง',
        language_th_sound: 'จงเลือกคำตอบที่ถูกต้อง',
        language_en: 'Command',
        language_en_ai: '',
        language_en_sound: '',
        language_cn: '命令',
        language_cn_ai: '',
        language_cn_sound: '',
    },
    {
        id: 2,
        topic: 'คำถาม',
        language_th: 'คำถาม',
        language_th_ai: '',
        language_th_sound: '',
        language_en: '',
        language_en_ai: '',
        language_en_sound: '',
        language_cn: '',
        language_cn_ai: '',
        language_cn_sound: '',
    },
    {
        id: 3,
        topic: 'คำตอบ',
        language_th: 'กานดาได้รับเงินเดือนเดือนละ 52,680 บาท ในเดือนนี้เขาได้รับเงินเดือนรวม กับเงินโบนัส 111,350 บาท “กานดาได้รับเงินโบนัสกี่บาท” เขียนเป็นประโยคสัญลักษณ์ได้อย่างไร?',
        language_th_sound: '',
        language_en: '',
        language_en_ai: '',
        language_en_sound: '',
        language_cn: '',
        language_cn_ai: '',
        language_cn_sound: '',
    },
    {
        id: 4,
        topic: 'คำอธิบาย',
        language_th: 'คำอธิบาย',
        language_th_sound: '',
        language_en: '',
        language_en_ai: '',
        language_en_sound: '',
        language_cn: '',
        language_cn_ai: '',
        language_cn_sound: '',
    },
    {
        id: 5,
        topic: 'คำสั่ง',
        language_th: 'คำสั่ง',
        language_th_sound: '',
        language_en: '',
        language_en_ai: '',
        language_en_sound: '',
        language_cn: '',
        language_cn_ai: '',
        language_cn_sound: '',
    },
    {
        id: 6,
        topic: 'คำสั่งพิเศษ',
        language_th: 'คำสั่งพิเศษ',
        language_th_sound: '',
        language_en: '',
        language_en_ai: '',
        language_en_sound: '',
        language_cn: '',
        language_cn_ai: '',
        language_cn_sound: '',
    },
    {
        id: 7,
        topic: 'คำอธิบายคำสั่ง',
        language_th: 'คำอธิบายคำสั่ง',
        language_th_sound: '',
        language_en: '',
        language_en_ai: '',
        language_en_sound: '',
        language_cn: '',
        language_cn_ai: '',
        language_cn_sound: '',
    },
    {
        id: 8,
        topic: 'คำสั่งพิเศษ',
        language_th: 'คำสั่งพิเศษ',
        language_th_sound: '',
        language_en: '',
        language_en_ai: '',
        language_en_sound: '',
        language_cn: '',
        language_cn_ai: '',
        language_cn_sound: '',
    },
    {
        id: 9,
        topic: 'คำอธิบายคำสั่งพิเศษ',
        language_th: 'คำอธิบายคำสั่งพิเศษ',
        language_th_sound: '',
        language_en: '',
        language_en_ai: '',
        language_en_sound: '',
        language_cn: '',
        language_cn_ai: '',
        language_cn_sound: '',
    },
    {
        id: 10,
        topic: 'คำสั่งพิเศษ',
        language_th: 'คำสั่งพิเศษ',
        language_th_sound: '',
        language_en: '',
        language_en_ai: '',
        language_en_sound: '',
        language_cn: '',
        language_cn_ai: '',
        language_cn_sound: '',
    },
];

const getComponentSound = (record: Record<string, unknown>, index: number, language_sound: string): ReactNode => {

    if ((record as RowData)[language_sound] === '') {
        return (
            <div className='flex gap-4 items-center'>
                <div className='w-4 h-4 bg-danger rounded-full' />
                <button type="button" className="btn btn-primary w-8 h-8 p-0 rounded-full">
                    <IconPlus className="w-5 h-5" duotone={false} />
                </button>
            </div>
        );
    }

    return (
        <div className='flex gap-4 items-center'>
            <div className='w-4 h-4 bg-success rounded-full' />
            <button type="button" className="btn btn-primary w-8 h-8 p-0 rounded-full">
                <IconVolumeLoud className="w-4 h-4" />
            </button>
            <button type="button" className="btn btn-primary w-8 h-8 p-0 rounded-full">
                <IconTrashLines duotone={false} className="w-5 h-5" />
            </button>
        </div>
    );
}

const rowColumns: DataTableColumn[] = [
    {
        accessor: 'topic',
        title: 'โจทย์'
    },
    {
        accessor: 'language_th',
        width: 450,
        title: 'ภาษาไทย (เริ่มต้น)',
        render: (record: Record<string, unknown>, index: number) => (
            <div className='text-wrap'>{(record as RowData).language_th}</div>
        ),
    },
    {
        accessor: 'language_th_ai',
        width: 450,
        title: 'ข้อความสำหรับ AI (ภาษาไทย)',
        render: (record: Record<string, unknown>, index: number) => (
            <TextareaAutosize
                rows={1}
                className="form-textarea"
                placeholder="Language translation..."
                required
                defaultValue={(record as unknown as RowData).language_th}
            />
        ),
    },
    {
        accessor: 'language_th_sound',
        width: 200,
        title: 'เสียงภาษาไทย',
        render: (record: Record<string, unknown>, index: number) => getComponentSound(record, index, "language_th_sound"),
    },
    {
        accessor: 'language_en', title: 'ภาษาอังกฤษ',
        width: 450,
        render: (record: Record<string, unknown>, index: number) => (
            <div className='text-wrap'>{(record as RowData).language_en}</div>
        ),
    },
    {
        accessor: 'language_en_ai',
        width: 450,
        title: 'ข้อความสำหรับ AI (ภาษาอังกฤษ)',
        render: (record: Record<string, unknown>, index: number) => (
            <TextareaAutosize
                rows={1}
                className="form-textarea"
                placeholder="Language translation..."
                required
                defaultValue={(record as unknown as RowData).language_en}
            />
        ),
    },
    {
        accessor: 'language_en_sound',
        width: 200,
        title: 'เสียงภาษาอังกฤษ',
        render: (record: Record<string, unknown>, index: number) => getComponentSound(record, index, "language_en_sound"),
    },
    {
        accessor: 'language_cn',
        width: 450,
        title: 'ภาษาจีน',
        render: (record: Record<string, unknown>, index: number) => (
            <div className='text-wrap'>{(record as RowData).language_cn}</div>
        ),
    },
    {
        accessor: 'language_cn_ai',
        width: 450,
        title: 'ข้อความสำหรับ AI (ภาษาจีน)',
        render: (record: Record<string, unknown>, index: number) => (
            <TextareaAutosize
                rows={1}
                className="form-textarea"
                placeholder="Language translation..."
                required
                defaultValue={(record as unknown as RowData).language_cn}
            />
        ),
    },
    {
        accessor: 'language_cn_sound',
        width: 200,
        title: 'เสียงภาษาจีน',
        render: (record: Record<string, unknown>, index: number) => getComponentSound(record, index, "language_cn_sound"),
    },
];

const rowData2: RowData[] = [
    {
        id: 1,
        answer: 'ตัวเลือกคำตอบที่ 1',
        language_th: '30มีค่ามากกว่า25',
        language_th_ai: '30มีค่ามากกว่า25',
        language_th_sound: '30มีค่ามากกว่า25',
        language_en: 'Correct answer',
        language_en_ai: 'Correct answer',
        language_en_sound: 'Correct answer',
        language_cn: '正确答案',
        language_cn_ai: '正确答案',
        language_cn_sound: '正确答案',
    },
    {
        id: 2,
        answer: 'ตัวเลือกคำตอบที่ 2',
        language_th: '25มีค่าน้อยกว่า30',
        language_th_ai: '25มีค่าน้อยกว่า30',
        language_th_sound: '25มีค่าน้อยกว่า30',
        language_en: '25 is less than 30',
        language_en_ai: '25 is less than 30',
        language_en_sound: '25 is less than 30',
        language_cn: '25小于30',
        language_cn_ai: '25小于30',
        language_cn_sound: '25小于30',
    },
    {
        id: 3,
        answer: 'ตัวเลือกคำตอบที่ 3',
        language_th: '25มีค่าเท่ากับ30',
        language_th_ai: '25มีค่าน้อยกว่า30',
        language_th_sound: '25มีค่าน้อยกว่า30',
        language_en: '25 is less than 30',
        language_en_ai: '25 is less than 30',
        language_en_sound: '',
        language_cn: '25小于30',
        language_cn_ai: '25小于30',
        language_cn_sound: '',
    },
    {
        id: 4,
        answer: 'ตัวเลือกคำตอบที่ 4',
        language_th: '25มีค่าน้อยกว่า30',
        language_th_ai: '25มีค่าน้อยกว่า30',
        language_th_sound: '25มีค่าน้อยกว่า30',
        language_en: '25 is less than 30',
        language_en_ai: '25 is less than 30',
        language_en_sound: '',
        language_cn: '25小于30',
        language_cn_ai: '25小于30',
        language_cn_sound: '25小于30',
    },
    {
        id: 5,
        answer: 'ตัวเลือกคำตอบที่ 5',
        language_th: '25มีค่าเท่ากับ30',
        language_th_ai: '25มีค่าน้อยกว่า30',
        language_th_sound: '25มีค่าน้อยกว่า30',
        language_en: '25 is less than 30',
        language_en_ai: '25 is less than 30',
        language_en_sound: '25 is less than 30',
        language_cn: '25小于30',
        language_cn_ai: '25小于30',
        language_cn_sound: '',
    },
    {
        id: 6,
        answer: 'ตัวเลือกคำตอบที่ 6',
        language_th: '25มีค่าน้อยกว่า30',
        language_th_ai: '25มีค่าน้อยกว่า30',
        language_th_sound: '',
        language_en: '25 is less than 30',
        language_en_ai: '25 is less than 30',
        language_en_sound: '',
        language_cn: '25小于30',
        language_cn_ai: '25小于30',
        language_cn_sound: '',
    },
    {
        id: 7,
        answer: 'ตัวเลือกคำตอบที่ 7',
        language_th: '25มีค่าเท่ากับ30',
        language_th_ai: '25มีค่าน้อยกว่า30',
        language_th_sound: '',
        language_en: '25 is less than 30',
        language_en_ai: '25 is less than 30',
        language_en_sound: '',
        language_cn: '25小于30',
        language_cn_ai: '25小于30',
        language_cn_sound: '',
    },
    {
        id: 8,
        answer: 'ตัวเลือกคำตอบที่ 8',
        language_th: '25มีค่าน้อยกว่า30',
        language_th_ai: '25มีค่าน้อยกว่า30',
        language_th_sound: '',
        language_en: '25 is less than 30',
        language_en_ai: '25 is less than 30',
        language_en_sound: '',
        language_cn: '25小于30',
        language_cn_ai: '25小于30',
        language_cn_sound: '25小于30',
    },
];

const rowColumns2: DataTableColumn[] = [
    {
        accessor: 'answer',
        title: 'เฉลย'
    }, {
        accessor: 'language_th',
        width: 450,
        title: 'ภาษาไทย (เริ่มต้น)',
        render: (record: Record<string, unknown>, index: number) => (
            <div className='text-wrap'>{(record as RowData).language_th}</div>
        ),
    },
    {
        accessor: 'language_th_ai',
        width: 450,
        title: 'ข้อความสำหรับ AI (ภาษาไทย)',
        render: (record: Record<string, unknown>, index: number) => (
            <TextareaAutosize
                rows={1}
                className="form-textarea"
                placeholder="Language translation..."
                required
                defaultValue={(record as unknown as RowData).language_th}
            />
        ),
    },
    {
        accessor: 'language_th_sound',
        width: 200,
        title: 'เสียงภาษาไทย',
        render: (record: Record<string, unknown>, index: number) => getComponentSound(record, index, "language_th_sound"),
    },
    {
        accessor: 'language_en', title: 'ภาษาอังกฤษ',
        width: 450,
        render: (record: Record<string, unknown>, index: number) => (
            <div className='text-wrap'>{(record as RowData).language_en}</div>
        ),
    },
    {
        accessor: 'language_en_ai',
        width: 450,
        title: 'ข้อความสำหรับ AI (ภาษาอังกฤษ)',
        render: (record: Record<string, unknown>, index: number) => (
            <TextareaAutosize
                rows={1}
                className="form-textarea"
                placeholder="Language translation..."
                required
                defaultValue={(record as unknown as RowData).language_en}
            />
        ),
    },
    {
        accessor: 'language_en_sound',
        width: 200,
        title: 'เสียงภาษาอังกฤษ',
        render: (record: Record<string, unknown>, index: number) => getComponentSound(record, index, "language_en_sound"),
    },
    {
        accessor: 'language_cn',
        width: 450,
        title: 'ภาษาจีน',
        render: (record: Record<string, unknown>, index: number) => (
            <div className='text-wrap'>{(record as RowData).language_cn}</div>
        ),
    },
    {
        accessor: 'language_cn_ai',
        width: 450,
        title: 'ข้อความสำหรับ AI (ภาษาจีน)',
        render: (record: Record<string, unknown>, index: number) => (
            <TextareaAutosize
                rows={1}
                className="form-textarea"
                placeholder="Language translation..."
                required
                defaultValue={(record as unknown as RowData).language_cn}
            />
        ),
    },
    {
        accessor: 'language_cn_sound',
        width: 200,
        title: 'เสียงภาษาจีน',
        render: (record: Record<string, unknown>, index: number) => getComponentSound(record, index, "language_cn_sound"),
    },
];

export { rowData, rowColumns, rowData2, rowColumns2 };

export type { RowData };
