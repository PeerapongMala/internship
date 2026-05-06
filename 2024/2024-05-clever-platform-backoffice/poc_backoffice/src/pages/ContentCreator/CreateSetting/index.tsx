import WizardBar from "../components/organism/WizardBar";
import {
    tabs,
    optionAffiliation,
    optionYear,
    optionGroup,
    optionSubject,
    optionLesson,
    optionSubLesson,
    optionBloom,
    optionSubStandard1,
    optionExerciseType,
    optionDifficulty,
    optionTimerBetweenPlay,
    optionTimerBetweenPlaySecond,
} from "./mock";
import Box from "../components/atom/Box";
import { Select } from "../../../components/Input";
import { Divider } from "../../../components/Divider";
import BaseInformation from "../components/template/BaseInformation";
import FooterForm from "../components/organism/FooterForm";

const CreateSetting = () => {

    return (
        <div className='w-full'>
            <Box className="bg-white shadow-md p-5 rounded-lg w-full">
                <WizardBar tabs={tabs} />
            </Box>

            <div className="flex gap-4 pt-5">
                <div className="flex flex-col gap-6 w-2/3">
                    <Box>
                        <div className="flex w-full justify-between">
                            <h1 className="text-xl font-bold">ด่านที่ 1</h1>
                            <button className="btn btn-outline-primary w-44">
                                เรียงลำดับด่าน
                            </button>
                        </div>
                        <Divider />
                        <div className='grid grid-cols-4 gap-4'>
                            <Select
                                label="สังกัดวิชา"
                                defaultValue={optionAffiliation[0]}
                                options={optionAffiliation}
                                required
                            />
                            <Select
                                label="ชั้นปี"
                                defaultValue={optionYear[0]}
                                options={optionYear}
                                required
                            />
                            <Select
                                label="กลุ่มวิชา"
                                defaultValue={optionGroup[0]}
                                options={optionGroup}
                                required
                            />
                            <Select
                                label="วิชา"
                                defaultValue={optionSubject[0]}
                                options={optionSubject}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="บทเรียน"
                                defaultValue={optionLesson[0]}
                                options={optionLesson}
                                required
                            />
                            <Select
                                label="บทเรียนย่อย"
                                defaultValue={optionSubLesson[0]}
                                options={optionSubLesson}
                                required
                            />
                        </div>

                        <div className="w-full grid grid-cols-2 gap-2 text-base bg-gray-100 p-5 my-4 rounded-md">
                            <div>สาระการเรียนรู้:</div>
                            <div>xxxxxxxx</div>
                            <div>มาตรฐานหลัก:</div>
                            <div>xxxxxxxx</div>
                            <div>ตัวชี้วัด:</div>
                            <div>xxxxxxxx</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="ทฤษฎีการวัดพฤติกรรม (Bloom)"
                                defaultValue={optionBloom[0]}
                                options={optionBloom}
                                required
                            />
                            <Select
                                label="มาตรฐานย่อย 1"
                                defaultValue={optionSubStandard1[0]}
                                options={optionSubStandard1}
                                required
                            />
                            <Select
                                label="มาตรฐานย่อย 2"
                                defaultValue={optionSubStandard1[0]}
                                options={optionSubStandard1}
                                required
                            />
                            <Select
                                label="มาตรฐานย่อย 3"
                                defaultValue={optionSubStandard1[0]}
                                options={optionSubStandard1}
                                required
                            />
                            <Select
                                label="<Tag typ1 (สร้างในระดับวิชา)> (เลือกได้มากกว่า 1)"
                                defaultValue={optionSubStandard1[0]}
                                options={optionSubStandard1}
                                required
                                isMulti
                            />
                            <Select
                                label="Tag ระดับวิชา"
                                defaultValue={optionSubStandard1[0]}
                                options={optionSubStandard1}
                                required
                            />
                            <Select
                                label="Tag ระดับวิชา"
                                defaultValue={optionSubStandard1[0]}
                                options={optionSubStandard1}
                                required
                            />
                        </div>
                    </Box>

                    <Box className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-bold">ตั้งค่าคำถาม (ค่าเริ่มต้น)</h1>
                            <p className="text-sm text-white-dark"><span className='text-red-500'>*</span>กรุณาตรวจสอบก่อนเผยแพร่ข้อมูล หลังจากที่เผยแพร่ข้อมูลแล้ว คุณจะไม่สามารถแก้ไขการตั้งค่านี้ได้</p>
                        </div>
                        <Divider />
                        <div className="flex items-center justify-between mb-1">
                            <div>รูปแบบคำถาม (ค่าเริ่มต้น):</div>
                            <div className="flex gap-2">
                                <input type="text" value={"คำถามปรนัย (Multiple Choices)"} className="form-input" readOnly />
                                <button className="btn btn-outline-primary w-44">
                                    เปลี่ยน
                                </button>
                            </div>
                        </div>
                        <Divider />

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="ประเภทแบบฝึกหัด"
                                defaultValue={optionExerciseType[0]}
                                options={optionExerciseType}
                                required
                            />
                            <Select
                                label="ระดับความยาก"
                                defaultValue={optionDifficulty[0]}
                                options={optionDifficulty}
                                required
                            />
                        </div>
                        <div className="mt-2 flex flex-col gap-2">
                            <div>จำนวนคำถามที่แสดงในเกม:</div>
                            <div>สุ่มเลือก 3 คำถาม </div>
                        </div>
                    </Box>

                    <Box className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-bold">ตั้งค่าการการเล่นเกม</h1>
                            <p className="text-sm text-white-dark"><span className='text-red-500'>*</span>กรุณาตรวจสอบก่อนเผยแพร่ข้อมูล หลังจากที่เผยแพร่ข้อมูลแล้ว คุณจะไม่สามารถแก้ไขการตั้งค่านี้ได้</p>
                        </div>
                        <Divider />

                        <div className="flex gap-4 items-center">
                            <label className="w-12 h-6 relative">
                                <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-success before:transition-all before:duration-300"></span>
                            </label>
                            <div>ล็อกด่าน: ไม่สามารถเล่นด่านต่อไปได้ ถ้าหากไม่ผ่านด่านนี้</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="การจับเวลาระหว่างเล่น (ค่าเริ่มต้น)"
                                defaultValue={optionTimerBetweenPlay[0]}
                                options={optionTimerBetweenPlay}
                                required
                            />
                            <Select
                                label="จำนวน (วินาที)"
                                defaultValue={optionTimerBetweenPlaySecond[0]}
                                options={optionTimerBetweenPlaySecond}
                                required
                            />
                        </div>
                        <div className="mt-2">
                            หากต้องการแก้ไขรูปแบบตัวอักษร ฉาก หรือตัวละครบอส กรุณาแก้ไขที่การตั้งค่า<a href="" className="text-primary underline">ค่าเริ่มต้นการแสดงผลด่าน</a>
                        </div>
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

export default CreateSetting;
