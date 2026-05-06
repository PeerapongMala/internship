
import { TDocumentTemplate, TTemplateProps } from '@domain/g06/g06-d07/local/types/template';
import { signaturesDataTemplate, studentDataTemplate, TemplateScores } from '../../options';

// million-ignore
const CWTemplate1 = ({
    templateData,
    studentData = studentDataTemplate,
    scores = TemplateScores,
    signatures = signaturesDataTemplate,
}: TTemplateProps) => {
    // จัดการโลโก้
    const logoSrc =
        typeof templateData.logo_image === 'string'
            ? templateData.logo_image
            : templateData.logo_image
                ? URL.createObjectURL(templateData.logo_image)
                : null;

    // จัดการพื้นหลัง
    const pageBgStyle: React.CSSProperties = {
        backgroundColor: templateData.colour_setting?.position1 || '',
        padding: '10px',
        width: "794px",
        height: "1123px",
        margin: "0 auto",
    };


    return (
        <div className="px-2" style={pageBgStyle}>
            <div
                style={{
                    backgroundColor: templateData.colour_setting?.position3 || '',
                    color: '',
                }}>
                <div className='p-5 relative'>
                    {/* โลโก้ */}
                    {/* {logoSrc ? (
                        <div className="absolute top-4 left-5 w-16 h-20">
                            <img
                                src={logoSrc}
                                alt="Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="absolute top-4 left-5 w-16 h-20 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-xs text-center">โลโก้<br />โรงเรียน</span>
                        </div>
                    )} */}
                    {/* Header */}
                    <div className="text-center mb-4 relative">
                        <h2 className="text-[16px] font-bold">แบบรายงานประจำตัวนักเรียน : ผลการพัฒนาคุณภาพผู้เรียนรายบุคคล(ปพ.6)</h2>
                        <p className="text-[14px] text-gray-600">โรงเรียนวัดตำหนักใต้ (วิลาศโอสถานนท์นุเคราะห์)สำนักงานเขตพื้นที่การศึกษานนทบุรี เขต 1</p>
                        <p className="text-[14px] text-gray-600">ชั้นมัธยมศึกษาปีที่ 6 ปีการศึกษา 2566</p>
                        {/* <div className="absolute right-0 top-10">
                            <div>{studentData.province}</div>
                        </div> */}
                    </div>

                </div>

            </div>
            {/* Student Info */}
            <div className="w-full grid grid-cols-3 gap-5 px-20 mb-4 mt-5 text-sm justify-center items-center">
                <div className='col-span-2 flex gap-5'>
                    <div ><strong>เลขประจำตัว:</strong> {studentData.id}</div>
                    <div><strong>ชื่อ:</strong> {studentData.name}</div>
                </div>

                <div className='col-span-1'><strong>เลขที่:</strong> {studentData.number}</div>
            </div>

            <div className='relative'>
                <div className="w-full flex justify-center items-center absolute top-[100px]  opacity-[0.05] pointer-events-none">
                    {templateData.background_image && (
                        <img
                            src={
                                typeof templateData.background_image === "string"
                                    ? templateData.background_image
                                    : URL.createObjectURL(templateData.background_image)
                            }
                            alt="ตราสัญลักษณ์"
                            className="size-[620px] object-contain"
                        />
                    )}
                </div>
            </div>

            {/* Table: Subject Scores */}
            <div className="mb-5  relative">
                <table className="w-full  border" >
                    <tbody>

                        <tr
                            className=""
                            style={{ backgroundColor: templateData.colour_setting?.position3 || '', color: '' }}
                        >
                            <td rowSpan={15} className="relative w-8 border border-gray-300">
                                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                                    <div className="-rotate-90 transform text-nowrap text-center">
                                        ผลการเรียนรายวิชา
                                    </div>
                                </div>
                            </td>
                            <th className="border border-gray-300 !p-1.5 text-center">รหัสวิขา</th>
                            <th className="border border-gray-300 !p-1.5 text-center">รายวิชา</th>
                            <th className="border border-gray-300 !p-1.5 text-center">เวลาเรียน <br /> (ชั่วโมง/ปี)</th>
                            <th className="border border-gray-300 !p-1.5 text-center">คะแนนเต็ม</th>
                            <th className="border border-gray-300 !p-1.5 text-center">
                                เฉลี่ยในชั้นเรียน
                            </th>
                            <th className="border border-gray-300 !p-1.5 text-center">
                                คะแนนที่ได้
                            </th>
                            <th className="border border-gray-300 !p-1.5 text-center">
                                ผลการเรียน
                            </th>
                            <th className="border border-gray-300 !p-1.5 text-center">หมายเหตุ</th>
                        </tr>


                        {scores.map((score, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 !p-1.5">{score.subject_code ?? ''}</td>
                                <td className="border border-gray-300 !p-1.5">{score.subject}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{score.study_time}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{score.study_total}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{score.semester2}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{score.total}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{score.grade}</td>
                                <td className="border border-gray-300 !p-1.5 text-center"></td>
                            </tr>
                        ))}
                        <tr>
                            <td className="border border-gray-300 !p-1.5 text-center" colSpan={2}>รวม</td>
                            <td className="border border-gray-300 !p-1.5 text-center">2,062</td>
                            <td className="border border-gray-300 !p-1.5 text-center">1000.00</td>
                            <td className="border border-gray-300 !p-1.5 text-center"></td>
                            <td className="border border-gray-300 !p-1.5 text-center">
                                -
                            </td>
                            <td className="border border-gray-300 !p-1.5 text-center"
                            >
                                -
                            </td>
                            <td className="border border-gray-300 !p-1.5 text-center"
                            >

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Summary Section - 2 Columns Layout */}
            <div className="w-full flex mt-3">
                {/* Left Column: Summary Table */}
                <div className="w-full ">
                    <div>
                        <table className="w-full text-xs border-collapse">
                            <tbody
                                style={{
                                    backgroundColor: templateData.colour_setting?.position2 || '',
                                }}>
                                <tr>
                                    <td className="border border-gray-300 !p-1">คะแนนคิดเป็นร้อยละ</td>
                                    <td className="border border-gray-300 !p-1 text-center">9.00</td>

                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">คะแนนรวมได้ลำดับที่ </td>
                                    <td className="border border-gray-300 !p-1 text-center">10</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการเรียนเฉลี่ย</td>
                                    <td className="border border-gray-300 !p-1 text-center">0.46</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการเรียนเฉลี่ยได้ลำดับที่ </td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}
                                    >
                                        1
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐาน</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>21</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติม</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>6</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">รวมหน่วยกิต/น้ำหนัก</td>

                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>27</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='w-full mt-3'>
                        <table className="w-full text-xs border-collapse">
                            <tbody
                                style={{
                                    backgroundColor: templateData.colour_setting?.position2 || '',
                                }}>
                                <tr>
                                    <td className="border border-gray-300 !p-1" colSpan={2}>ผลการประเมินกิจกรรมพัฒนาผู้เรียน</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">แนะแนว</td>
                                    <td className="border border-gray-300 !p-1 text-center">ผ่าน</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ลูกเสือ - เนตรนารี</td>
                                    <td className="border border-gray-300 !p-1 text-center">ไม่ผ่าน</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ชุมนุม</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}
                                    >
                                        ผ่าน
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">กิจกรรมเพื่อสังคมและสาธารณประโยชน์</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}
                                    >
                                        ผ่าน
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='w-full mt-3'>
                        <table className="w-full text-xs border-collapse">
                            <tbody
                                style={{
                                    backgroundColor: templateData.colour_setting?.position2 || '',
                                }}>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการประเมินคุณลักษณะอันพึงประสงค์</td>
                                    <td className="border border-gray-300 !p-1 text-center">ผ่าน</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการประเมินการอ่าน คิดวิเคราะห์และเขียน</td>
                                    <td className="border border-gray-300 !p-1 text-center">ไม่ผ่าน</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการประเมินสมรรถนะสำคัญจของผู้เรียน</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}
                                    >
                                        ผ่าน
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* Right Column: Signatures */}
                <div className="w-full flex flex-col items-center gap-6">
                    <div className="text-center">
                        <p className="text-sm">ลงชื่อ{" "}<span className="inline-block w-48 border-b border-black border-dotted"></span></p>
                        <p className="text-sm">( {signatures.homeroom.name} )</p>
                        <p className="text-sm">{signatures.homeroom.position}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm">ลงชื่อ{" "}<span className="inline-block w-48 border-b border-black border-dotted"></span></p>
                        <p className="text-sm">( {signatures.director.name} )</p>
                        <p className="text-sm">{signatures.head.position}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm">ลงชื่อ{" "}<span className="inline-block w-48 border-b border-black border-dotted"></span></p>
                        <p className="text-sm">( {signatures.director.name} )</p>
                        <p className="text-sm">{signatures.director.position}</p>
                    </div>
                    <div className="text-center mt-4 ">
                        <p className="text-sm">ลงชื่อ{" "}<span className="inline-block w-48 border-b border-black border-dotted"></span></p>
                        <p className="text-sm mt-2">( <span className="inline-block w-48 border-b border-black border-dotted"></span> )</p>
                        <p className="text-sm">ผู้ปกครองนักเรียน</p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default CWTemplate1;