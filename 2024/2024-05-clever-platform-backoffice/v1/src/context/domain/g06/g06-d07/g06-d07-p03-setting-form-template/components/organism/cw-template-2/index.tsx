
import { TDocumentTemplate, TTemplateProps } from '@domain/g06/g06-d07/local/types/template';
import { signaturesDataTemplate, studentDataTemplate, summaryDataTemplate, TemplateScores } from '../../options';
// million-ignore
const CWTemplate2 = ({
    templateData,
    studentData = studentDataTemplate,
    scores = TemplateScores,
    summary = summaryDataTemplate,
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
                    {logoSrc ? (
                        <div className="absolute top-7 left-5 w-16 h-16">
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
                    )}
                    <p className='w-[150px] absolute top-[100px] left-0'>โรงเรียนวัดตำหนักใต้</p>
                    {/* Header */}
                    <div className="text-center mb-4 relative">
                        <h2 className="text-[16px] font-bold">แบบรายงานประจำตัวนักเรียน</h2>
                        <p className="text-[14px] text-gray-600">ชั้นมัธยมศึกษาปีที่ 6 ปีการศึกษา 2566</p>
                        <p className="text-[14px] text-gray-600">สำนักงานเขตพื้นที่การศึกษานนทบุรี เขต 1</p>
                        <div className="absolute right-0 top-10">
                            <div>{studentData.province}</div>
                        </div>
                    </div>

                </div>

            </div>
            {/* Student Info */}
            <div className="w-full grid grid-cols-3 gap-5 px-20 mb-4 text-sm mt-5 justify-center items-center">
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
            <div className="mb-5 relative">
                <table className="w-full  border" >
                    <colgroup>
                        <col style={{ width: '25%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                    </colgroup>
                    <thead>
                        <tr style={{ backgroundColor: templateData.colour_setting?.position3 || '#F0FAFF' }}>
                            <th className="border border-gray-300 !p-1.5 text-center" rowSpan={3}>
                                กลุ่มสาระการเรียนรู้
                            </th>
                            <th className="border border-gray-300 !p-1.5 text-center" rowSpan={2}>
                                น้ำหนัก
                            </th>
                            <th className="border border-gray-300 !p-1.5 text-center">คะแนน<br />เต็ม</th>
                            <th className="border border-gray-300 !p-1.5 text-center">เฉลี่ย<br />ในชั้นเรียน</th>
                            <th className="border border-gray-300 !p-1.5 text-center ">คะแนน<br />ที่ได้</th>
                            <th className="border border-gray-300 !p-1.5 text-center" rowSpan={2}>
                                ระดับ
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 !p-1.5">{score.subject}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{score.weight}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{score.semester1}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{score.semester2}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{score.total}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{score.grade}</td>
                            </tr>
                        ))}
                        <tr>
                            <td className="border border-gray-300 !p-1.5 text-center"><strong>ผลการเรียนเฉลี่ย</strong></td>
                            <td className="border border-gray-300 !p-1.5 text-center"><strong>{summary.totalCredits}</strong></td>
                            <td className="border border-gray-300 !p-1.5"></td>
                            <td className="border border-gray-300 !p-1.5"></td>
                            <td className="border border-gray-300 !p-1.5"></td>
                            <td className="border border-gray-300 !p-1.5 text-center"
                                style={{
                                    backgroundColor: templateData.colour_setting?.position3 || '#F0FAFF',
                                    color: '',
                                }}>
                                <strong
                                    className=" px-2 py-1 rounded"
                                >
                                    {summary.gpa}
                                </strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Summary Section - 2 Columns Layout */}
            <div className="w-full flex mt-5">
                {/* Left Column: Summary Table */}
                <div className="w-full">
                    <div>
                        <table className="w-full text-xs border-collapse">
                            <thead
                            >
                                <tr
                                    style={{
                                        backgroundColor: templateData.colour_setting?.position3 || '#F0FAFF',
                                        color: '',
                                    }}
                                >
                                    <th className="border-t border-l border-r border-gray-300 py-3 text-center font-bold pt-5 relative" colSpan={1}>
                                        <p className=''>สรุปผลการเรียนตลอดหลักสูตร</p>
                                    </th>
                                    <th className="border border-gray-300 py-3 text-center font-bold" colSpan={2}>
                                        ผลการเรียน
                                    </th>
                                </tr>

                            </thead>
                            <tbody
                                style={{
                                    backgroundColor: templateData.colour_setting?.position2 || '',
                                }}>
                                <tr>
                                    <td className="border border-gray-300 !p-1">จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐาน</td>
                                    <td className="border border-gray-300 !p-1 text-center">21</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติม</td>
                                    <td className="border border-gray-300 !p-1 text-center">6</td>

                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">รวมหน่วยกิต/น้ำหนัก</td>
                                    <td className="border border-gray-300 !p-1 text-center">27</td>

                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ระดับผลการเรียนเฉลี่ย(GPA)</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}
                                        style={{
                                            backgroundColor: templateData.colour_setting?.position3 || '#F0FAFF',
                                            color: '',

                                        }}>
                                        {summary.gpa}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">คุณลักษณะอันพึงประสงค์ของสถานศึกษา*</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>ดีเยี่ยม</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">การอ่าน คิด วิเคราะห์และเขียน**</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>ดี</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">กิจกรรมพัฒนาผู้เรียน</td>

                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>ผ่าน</td>
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

export default CWTemplate2;