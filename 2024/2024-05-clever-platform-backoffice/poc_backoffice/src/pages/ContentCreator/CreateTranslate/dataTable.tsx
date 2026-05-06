import { ReactNode } from 'react';
import type { DataTableColumn } from "mantine-datatable";

interface RowData {
    id: number;
    answer?: string;
    topic?: string;
    language_th: string;
    language_en: string;
    language_ch: string;
    [key: string]: unknown;
}

const rowData: RowData[] = [
    {
        id: 1,
        topic: 'Command',
        language_th: 'จงเลือกคำตอบที่ถูกต้อง',
        language_en: 'Command',
        language_ch: '命令',
    },
    {
        id: 2,
        topic: 'คำถาม',
        language_th: 'คำถาม',
        language_en: '',
        language_ch: '',
    },
    {
        id: 3,
        topic: 'คำตอบ',
        language_th: 'กานดาได้รับเงินเดือนเดือนละ 52,680 บาท ในเดือนนี้เขาได้รับเงินเดือนรวม กับเงินโบนัส 111,350 บาท “กานดาได้รับเงินโบนัสกี่บาท” เขียนเป็นประโยคสัญลักษณ์ได้อย่างไร?',
        language_en: '',
        language_ch: '',
    },
    {
        id: 4,
        topic: 'คำอธิบาย',
        language_th: 'คำอธิบาย',
        language_en: '',
        language_ch: '',
    },
    {
        id: 5,
        topic: 'คำสั่ง',
        language_th: 'คำสั่ง',
        language_en: '',
        language_ch: '',
    },
    {
        id: 6,
        topic: 'คำสั่งพิเศษ',
        language_th: 'คำสั่งพิเศษ',
        language_en: '',
        language_ch: '',
    },
    {
        id: 7,
        topic: 'คำอธิบายคำสั่ง',
        language_th: 'คำอธิบายคำสั่ง',
        language_en: '',
        language_ch: '',
    },
    {
        id: 8,
        topic: 'คำสั่งพิเศษ',
        language_th: 'คำสั่งพิเศษ',
        language_en: '',
        language_ch: '',
    },
    {
        id: 9,
        topic: 'คำอธิบายคำสั่งพิเศษ',
        language_th: 'คำอธิบายคำสั่งพิเศษ',
        language_en: '',
        language_ch: '',
    },
    {
        id: 10,
        topic: 'คำสั่งพิเศษ',
        language_th: 'คำสั่งพิเศษ',
        language_en: '',
        language_ch: '',
    },
];

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
        accessor: 'language_en', title: 'ภาษาอังกฤษ',
        width: 450,
        render: (record: Record<string, unknown>, index: number) => (
            <textarea
                rows={1}
                className="form-textarea"
                placeholder="Language translation..."
                required
                value={(record as unknown as RowData).language_en}
            />
        ),
    },
    {
        accessor: 'language_ch', title: 'ภาษาจีน',
        width: 450,
        render: (record: Record<string, unknown>, index: number) => (
            <textarea
                rows={1}
                className="form-textarea"
                placeholder="Language translation..."
                required
                value={(record as unknown as RowData).language_ch}
            />
        ),
    },
];

const rowData2: RowData[] = [
    {
        id: 1,
        answer: 'ตัวเลือกคำตอบที่ 1',
        language_th: '30มีค่ามากกว่า25',
        language_en: 'Correct answer',
        language_ch: '正确答案',
    },
    {
        id: 2,
        answer: 'ตัวเลือกคำตอบที่ 2',
        language_th: '25มีค่าน้อยกว่า30',
        language_en: '',
        language_ch: '',
    },
    {
        id: 3,
        answer: 'ตัวเลือกคำตอบที่ 3',
        language_th: '25มีค่าเท่ากับ30',
        language_en: '',
        language_ch: '',
    },
    {
        id: 4,
        answer: 'ตัวเลือกคำตอบที่ 4',
        language_th: '25มีค่าน้อยกว่า30',
        language_en: '',
        language_ch: '',
    },
    {
        id: 5,
        answer: 'ตัวเลือกคำตอบที่ 5',
        language_th: '25มีค่าเท่ากับ30',
        language_en: '',
        language_ch: '',
    },
    {
        id: 6,
        answer: 'ตัวเลือกคำตอบที่ 6',
        language_th: '25มีค่าน้อยกว่า30',
        language_en: '',
        language_ch: '',
    },
    {
        id: 7,
        answer: 'ตัวเลือกคำตอบที่ 7',
        language_th: '25มีค่าเท่ากับ30',
        language_en: '',
        language_ch: '',
    },
    {
        id: 8,
        answer: 'ตัวเลือกคำตอบที่ 8',
        language_th: '25มีค่าน้อยกว่า30',
        language_en: '',
        language_ch: '',
    },
];

const rowColumns2: DataTableColumn[] = [
    {
        accessor: 'answer',
        title: 'เฉลย'
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
        accessor: 'language_en', title: 'ภาษาอังกฤษ',
        width: 450,
        render: (record: Record<string, unknown>, index: number) => (
            <textarea
                rows={1}
                className="form-textarea"
                placeholder="Language translation..."
                required
                value={(record as unknown as RowData).language_en}
            />
        ),
    },
    {
        accessor: 'language_ch', title: 'ภาษาจีน',
        width: 450,
        render: (record: Record<string, unknown>, index: number) => (
            <textarea
                rows={1}
                className="form-textarea"
                placeholder="Language translation..."
                required
                value={(record as unknown as RowData).language_ch}
            />
        ),
    },
];

export { rowData, rowColumns, rowData2, rowColumns2 };

export type { RowData };
