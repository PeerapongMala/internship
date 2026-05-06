import { Divider } from "../../../components/Divider";
import Box from "../components/atom/Box";
import FooterForm from "../components/organism/FooterForm";
import WizardBar from "../components/organism/WizardBar";
import BaseInformation from "../components/template/BaseInformation";
import { tabs } from "../CreateSetting/mock";

const CreatePublic = () => {
    return (
        <div className='w-full'>
            <Box className="bg-white shadow-md p-5 rounded-lg w-full">
                <WizardBar tabs={tabs} />
            </Box>
            <div className="flex gap-4 pt-5">
                <div className="flex flex-col gap-6 w-2/3">
                    <Box className="flex flex-col items-center gap-2 text-xl">
                        <div className="text-3xl font-bold">
                            ตรวจสอบความเรียบร้อย
                        </div>
                        <Divider />
                        <div>
                            กรุณาตรวจสอบก่อนเผยแพร่ข้อมูล หลังจากที่เผยแพร่ข้อมูลแล้ว
                        </div>
                        <div>
                            คุณจะ<span className="underline">ไม่สามารถแก้ไข</span>การตั้งค่าที่เกี่ยวข้องกับด่านได้
                        </div>
                        <Box className="bg-gray-100 rounded-sm flex flex-col gap-2 items-center justify-center text-base">
                            <div className="font-bold">
                                สิ่งที่คุณสามารถแแก้ไขได้หลังจากเผยแพร่ข้อมูล
                            </div>
                            <ul className="space-y-3 list-inside list-disc ml-2">
                                <li className="mb-1">
                                    {'การสะกดคำข้อความของโจทย์และคำตอบ'}
                                </li>
                                <li className="mb-1">
                                    {'การแปลภาษา'}
                                </li>
                                <li className="mb-1">
                                    {'การแก้ไขเสียง'}
                                </li>
                            </ul>

                        </Box>
                    </Box>
                    <Box className="flex justify-between bg-[#F5F5F5] shadow-md p-5 rounded-lg w-full">
                        <FooterForm />
                    </Box>
                </div>
                <div className="flex flex-col gap-6 w-1/3 h-fit">
                    <Box>
                        <BaseInformation />
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default CreatePublic;
