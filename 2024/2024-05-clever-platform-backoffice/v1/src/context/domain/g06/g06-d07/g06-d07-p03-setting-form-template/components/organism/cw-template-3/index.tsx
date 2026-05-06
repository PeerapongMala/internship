
import { TDocumentTemplate, TTemplateProps } from '@domain/g06/g06-d07/local/types/template';
import { signaturesDataTemplate, studentDataTemplate, summaryDataTemplate, TemplateScores } from '../../options';
// million-ignore
const CWTemplate3 = ({
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
                <div className='p-3 relative'>

                    {/* Header */}
                    <div className="text-center relative">
                        <div className='w-full flex justify-center mb-2'>
                            {logoSrc ? (
                                <div className=" top-4 left-5 w-16 h-16">
                                    <img
                                        src={logoSrc}
                                        alt="Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className=" top-4 left-5 w-16 h-20 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500 text-xs text-center">โลโก้<br />โรงเรียน</span>
                                </div>
                            )}
                        </div>

                        <h2 className="text-[16px] font-bold">แบบรายงานประจำตัวนักเรียน</h2>
                        <p className="text-[14px] text-gray-600">โรงเรียนวัดตำหนักใต้ (วิลาศโอสถานนท์นุเคราะห์)สำนักงานเขตพื้นที่การศึกษานนทบุรี เขต 1</p>
                        <p className="text-[14px] text-gray-600">ชั้นมัธยมศึกษาปีที่ 6 ปีการศึกษา 2566</p>

                    </div>

                </div>

            </div>
            {/* Student Info */}
            <div className="w-full grid grid-cols-3 gap-5 px-20 mb-4 text-sm mt-3 justify-center items-center">
                <div className='col-span-1'>
                    <div><strong>ชื่อ:</strong> {studentData.name}</div>
                </div>
                <div className='col-span-2 flex gap-5 justify-end'>
                    <div ><strong>เลขประจำตัว:</strong> {studentData.id}</div>
                    <div className=''><strong>เลขที่:</strong> {studentData.number}</div>
                </div>

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
                    <thead>
                        <tr style={{ backgroundColor: templateData.colour_setting?.position1 || '#fff' }}>
                            <th className="border border-gray-300 p-2 text-center w-20">รหัสวิชา</th>
                            <th className="border border-gray-300 p-2 text-center">กลุ่มสาระการเรียนรู้</th>
                            <th className="border border-gray-300 p-2 text-center">ประเภท</th>
                            <th className="border border-gray-300 p-2 text-center">หน่วยกิต</th>
                            <th className="border border-gray-300 !p-1.5 text-center">คะแนน<br />เต็ม</th>
                            <th className="border border-gray-300 !p-1.5 text-center w-20">เฉลี่ย<br />ในชั้นเรียน</th>
                            <th className="border border-gray-300 !p-1.5 text-center">คะแนน<br />ที่ได้</th>
                            <th className="border border-gray-300 p-2 text-center">
                                คุณลักษณะ
                            </th>
                            <th className="border border-gray-300 p-2 text-center">
                                อ่านคิดวิเคราะห์
                            </th>
                            <th className="border border-gray-300 p-2 text-center">
                                หมายเหตุ
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {scores.map((score, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 p-2">{score.subject_code}</td>
                                <td className="border border-gray-300 p-2">{score.subject}</td>
                                <td className="border border-gray-300 p-2 text-center">{score.type}</td>
                                <td className="border border-gray-300 p-2 text-center">{score.weight}</td>
                                <td className="border border-gray-300 p-2 text-center">{score.normal_score}</td>
                                <td className="border border-gray-300 p-2 text-center">0.00</td>
                                <td className="border border-gray-300 p-2 text-center">0.00</td>
                                <td className="border border-gray-300 p-2 text-center">{score.attribute}</td>
                                <td className="border border-gray-300 p-2 text-center">{score.read_things}</td>
                                <td className="border border-gray-300 p-2 text-center"></td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            {/* Summary Section - 2 Columns Layout */}
            <div className="w-full flex mt-5">
                {/* Left Column: Summary Table */}
                <div className="w-full">
                    <div>
                        <table className="w-full text-xs border-collapse"
                            style={{
                                backgroundColor: templateData.colour_setting?.position2 || templateData.colour_setting?.position1 || '#fff',
                            }}
                        >
                            <thead
                            >
                                <tr
                                    style={{
                                        backgroundColor: templateData.colour_setting?.position2 || templateData.colour_setting?.position1 || '#fff',
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
                            <tbody>
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
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>
                                        {summary.gpa}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการประเมินคุณลักษณะอันพึงประสงค์</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>ดีเยี่ยม</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการประเมินการอ่าน คิดวิเคราห์ และเขียน</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>ดี</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลกระทบพัฒนาผู้เรียน</td>

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

        </div >
    );
};

export default CWTemplate3;