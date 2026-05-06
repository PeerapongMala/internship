import { DataTable } from "mantine-datatable";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import Box from "../components/atom/Box";
import WizardBar from "../components/organism/WizardBar";
import { tabs } from "../CreateSetting/mock";
import { rowData, rowColumns, rowData2, rowColumns2 } from "./dataTable";
import { useState } from "react";
import { Select } from "../../../components/Input";
import FooterForm from "../components/organism/FooterForm";

const CreateSound = () => {
    const optionLanguage = [
        { value: 'th', label: 'ภาษาไทย' },
        { value: 'en', label: 'ภาษาอังกฤษ' },
        { value: 'cn', label: 'ภาษาจีน' },
    ];
    const [language, setLanguage] = useState(optionLanguage[0]);

    return (
        <div className='w-full flex flex-col gap-6'>
            <Box className="bg-white shadow-md p-5 rounded-lg w-full">
                <WizardBar tabs={tabs} />
            </Box>
            <Box className="flex flex-col gap-4">
                <Box className="bg-[#EAF1FF] flex flex-col gap-2 items-center justify-center">
                    <div className="font-bold text-xl">
                        ระบบช่วย Gen เสียงด้วย AI
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet consectetur. Urna in a.
                    </div>
                    <div className="flex gap-4">
                        <button className="btn btn-primary w-40">
                            สร้างเสียงด้วย AI
                        </button>
                        <button className="btn btn-outline-primary bg-white w-40">
                            ข้ามขั้นตอนนี้
                        </button>
                    </div>
                </Box>
                <div className='flex gap-4 font-bold text-lg justify-center items-center bg-gray-100 rounded-sm py-4'>
                    <div>คำถามข้อที่</div>
                    <button className="btn btn-primary p-0 w-11 h-11">
                        <IconCaretDown className='rotate-90 w-6 h-6' />
                    </button>
                    <div className='flex items-center gap-4'>
                        <input type="text" className="form-input w-11 text-lg" value={1} />
                        <div>/ 3</div>
                    </div>
                    <button className="btn btn-primary p-0 w-11 h-11">
                        <IconCaretDown className='-rotate-90 w-6 h-6' />
                    </button>
                </div>
                <div className="w-52 z-10">
                    <Select
                        label="เลือกภาษา"
                        defaultValue={optionLanguage[0]}
                        options={optionLanguage}
                        value={language}
                        onChange={(e) => setLanguage(e)}
                        required
                    />
                </div>
                <div className="datatables">
                    <Table1 language={language} />
                </div>
                <div className="datatables">
                    <Table2 language={language} />
                </div>
            </Box>
            <Box className="flex justify-between bg-[#F5F5F5] shadow-md p-5 rounded-lg w-full">
                <FooterForm />
            </Box>
        </div>
    );
};

const Table1 = ({ language }: { language: { value: string; label: string } }) => {
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const newRowColumns = rowColumns.filter((column) => {
        if (column.accessor.includes('language')) {
            if (column.accessor.includes(language.value)) {
                return column;
            }
        } else {
            return column;
        }
    })
    return (

        <DataTable
            className="whitespace-nowrap table-hover"
            records={rowData}
            columns={newRowColumns}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            highlightOnHover
            withTableBorder
            withColumnBorders
        />
    );
};

const Table2 = ({ language }: { language: { value: string; label: string } }) => {
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const newRowColumns = rowColumns2.filter((column) => {
        if (column.accessor.includes('language')) {
            if (column.accessor.includes(language.value)) {
                return column;
            }
        } else {
            return column;
        }
    })
    return (
        <DataTable
            className="whitespace-nowrap table-hover"
            records={rowData2}
            columns={newRowColumns}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            highlightOnHover
            withTableBorder
            withColumnBorders
        />
    );
}

export default CreateSound;
