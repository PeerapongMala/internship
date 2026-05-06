import { DataTable } from "mantine-datatable";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import Box from "../components/atom/Box";
import WizardBar from "../components/organism/WizardBar";
import { tabs } from "../CreateSetting/mock";
import { rowData, rowColumns, rowData2, rowColumns2 } from "./dataTable";
import { useState } from "react";
import FooterForm from "../components/organism/FooterForm";

const CreateTranslate = () => {
    return (
        <div className='w-full flex flex-col gap-6'>
            <Box className="bg-white shadow-md p-5 rounded-lg w-full">
                <WizardBar tabs={tabs} />
            </Box>
            <Box className="flex flex-col gap-4">
                <Box className="bg-[#EAF1FF] flex flex-col gap-2 items-center justify-center">
                    <div className="font-bold text-xl">
                        ระบบช่วยแปลภาษาด้วย AI
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet consectetur. Urna in a.
                    </div>
                    <div className="flex gap-4">
                        <button className="btn btn-primary w-40">
                            แปลภาษาด้วย AI
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
                <div className="datatables">
                    <Table1 />
                </div>
                <div className="datatables">
                    <Table2 />
                </div>
            </Box>
            <Box className="flex justify-between bg-[#F5F5F5] shadow-md p-5 rounded-lg w-full">
                <FooterForm />
            </Box>
        </div>
    );
};

const Table1 = () => {
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    return (

        <DataTable
            className="whitespace-nowrap table-hover"
            records={rowData}
            columns={rowColumns}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            highlightOnHover
            withTableBorder
            withColumnBorders
        />
    );
};

const Table2 = () => {
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    return (
        <DataTable
            className="whitespace-nowrap table-hover"
            records={rowData2}
            columns={rowColumns2}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            highlightOnHover
            withTableBorder
            withColumnBorders
        />
    );
}

export default CreateTranslate;
