import { TTemplateProps } from "@domain/g06/g06-d06/local/types/student-report-form";
import { safeJsonParse } from "@domain/g06/g06-d07/g06-d07-p03-setting-form-template/components/page/form-template";
import { roundNumber, roundNumberForString } from "@global/utils/number";
import { defaultTo } from "lodash";

// million-ignore
const CWTemplate2 = ({
    templateData,
    studentDetail,
    studentData,
    grades,
    generals,
    school,
    allsign,
    summary,
}: TTemplateProps) => {

    const colourSetting = safeJsonParse(templateData?.colour_setting) || {};

    // จัดการโลโก้
    const logoSrc =
        typeof templateData?.logo_image === 'string'
            ? templateData.logo_image
            : templateData?.logo_image
                ? URL.createObjectURL(templateData.logo_image)
                : null;


    // จัดการพื้นหลัง
    const pageBgStyle: React.CSSProperties = {
        backgroundColor: colourSetting?.position1 || '',
        width: '210mm',
        minHeight: '297mm',
    };


    // สมรรถนะ
    const capacityData = generals?.filter(d => d.generalType === 'สมรรถนะ');
    // กิจกรรมพัฒนาผู้เรียน
    const activityData = generals?.filter(d => d.generalType === 'กิจกรรมพัฒนาผู้เรียน');
    // คุณลักษณะอันพึงประสงค์
    const characteristicData = generals?.filter(d => d.generalType === 'คุณลักษณะอันพึงประสงค์');

    if (!characteristicData) return
    if (!activityData) return


    return (
        <div className="p-5 shadow-md border bg-white mb-6" style={pageBgStyle}>
            <div
                style={{
                    backgroundColor: colourSetting?.position3 || '',
                }}>
                <div className='p-5 relative'>
                    {/* โลโก้ */}
                    <div className="flex flex-col gap-2 relative">
                        {logoSrc ? (
                            <div className="absolute top-7 left-5 w-16 h-16">
                                <img
                                    src={logoSrc}
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                    crossOrigin="anonymous"
                                />
                            </div>
                        ) : (
                            <div className="absolute top-2 left-5 w-16 h-20 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500 text-xs text-center"></span>
                            </div>
                        )}
                        <p className="text-[14px] absolute top-[92px] bottom-0"> {school?.name}</p>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-3 relative pt-8">
                        <div className="flex flex-col gap-2 ">
                            <h2 className="text-[16px] font-bold">แบบรายงานประจำตัวนักเรียน</h2>
                            <p className="text-[14px]">
                                ชั้น {studentData?.year} ปีการศึกษา {studentData?.academic_year}
                            </p>
                            <p className="text-[14px]">
                                {school?.area}
                            </p>
                        </div>

                        <div className="absolute right-0 top-20">
                            <div>{studentData?.province}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Info */}
            <div className="w-full grid grid-cols-3 gap-5 px-20 mb-4 text-sm mt-5 justify-center items-center">
                <div className='col-span-2 flex gap-5'>
                    <div><strong>เลขประจำตัว:</strong> {studentData?.idNo}</div>
                    <div><strong>ชื่อ:</strong> {studentData?.fullname}</div>
                </div>
                <div className='col-span-1'><strong>เลขที่:</strong> {studentData?.studentNo}</div>
            </div>

            <div className='relative'>
                <div className="w-full flex justify-center items-center absolute top-[100px] opacity-[0.05] pointer-events-none">
                    {templateData?.background_image && (
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
            <div className="overflow-x-auto mb-6 relative">
                <table className="w-full border border-gray-300">
                    <colgroup>
                        <col style={{ width: '25%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                    </colgroup>
                    <thead>
                        <tr style={{ backgroundColor: colourSetting?.position3 || '#F0FAFF' }}>
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
                        {defaultTo(studentDetail?.dataJson?.subject, []).map((subject, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 !p-1.5">{subject.subjectName || '-'}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{subject.credits || 0}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{subject.totalScore || 0}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">
                                    {subject.avgScore ? roundNumber(subject.avgScore) : '0'}
                                </td>
                                <td className="border border-gray-300 !p-1.5 text-center">{subject.score || '0'}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">
                                    {roundNumberForString(subject.grade) || '0'}
                                </td>
                            </tr>
                        ))}

                        {/* Empty rows */}
                        {Array.isArray(studentDetail?.dataJson?.subject) && studentDetail.dataJson.subject.length <= 5 &&
                            [1, 2, 3, 4, 5].map((_, index) => (
                                <tr key={`empty-${index}`}>
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                </tr>
                            ))
                        }

                        {/* Total row end*/}
                        <tr>
                            <td className="border border-gray-300 !p-1.5 text-center ">ผลการเรียนเฉลี่ย</td>
                            <td className="border border-gray-300 !p-1.5 text-center ">{grades?.total_credits || '-'}</td>
                            <td className="border border-gray-300 !p-1.5 text-center ">{summary?.totalScore || '-'}</td>
                            <td className="border border-gray-300 !p-1.5 text-center ">
                                {summary?.avgScore ? roundNumber(summary.avgScore) : '-'}
                            </td>
                            <td className="border border-gray-300 !p-1.5 text-center ">{summary?.score || '-'}</td>
                            <td className="border border-gray-300 !p-1.5 text-center">{summary?.totalScore || '-'}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            {/* Summary Section - 2 Columns Layout */}
            <div className="w-full flex mt-5">
                {/* Left Column: Summary Table */}
                <div className="w-full">
                    <div>
                        <table className="w-full text-xs border-collapse border border-gray-300">
                            <thead>
                                <tr
                                    style={{
                                        backgroundColor: colourSetting?.position3 || '#F0FAFF',
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
                                    backgroundColor: colourSetting?.position2 || '',
                                }}>
                                <tr>
                                    <td className="border border-gray-300 !p-1">จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐาน</td>
                                    <td className="border border-gray-300 !p-1 text-center" >{grades?.normal_credits || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติม</td>
                                    <td className="border border-gray-300 !p-1 text-center">{grades?.extra_credits || '-'}</td>

                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">รวมหน่วยกิต/น้ำหนัก</td>
                                    <td className="border border-gray-300 !p-1 text-center"> {grades?.total_credits || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ระดับผลการเรียนเฉลี่ย(GPA)</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}
                                        style={{
                                            backgroundColor: colourSetting?.position3 || '#F0FAFF',
                                        }}>
                                        <p>{grades?.avgLearnScore || 0}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">คุณลักษณะอันพึงประสงค์ของสถานศึกษา*</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>
                                        {characteristicData?.length > 0 ?
                                            (characteristicData[0]?.studentIndicatorData?.find(d => d.indicatorGeneralName === 'ผลประเมินคุณลักษณะอันพึงประสงค์')?.value === 1 ? "ผ่าน" : "ไม่ผ่าน")
                                            : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">การอ่าน คิด วิเคราะห์และเขียน**</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>
                                        {characteristicData?.length > 0 ?
                                            (characteristicData[0]?.studentIndicatorData?.find(d => d.indicatorGeneralName === 'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-5')?.value === 1 ? "ผ่าน" : "ไม่ผ่าน")
                                            : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">กิจกรรมพัฒนาผู้เรียน</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>
                                        {activityData?.length > 0 ?
                                            (activityData[0]?.studentIndicatorData?.some(d => d.value === 1) ? "ผ่าน" : "ไม่ผ่าน")
                                            : '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Signatures */}
                <div className="w-full flex flex-col items-center gap-6">
                    <div className="text-center">
                        <p className="text-sm">
                            ลงชื่อ{" "}
                            <span className="inline-block w-48 border-b border-black border-dotted"></span>
                        </p>
                        <p className="text-sm">
                            (
                            {allsign?.subjectTeacher ? (
                                <span className="px-2 w-48 text-center ">
                                    {allsign.subjectTeacher}
                                </span>
                            ) : (
                                <span className="inline-block w-48 border-b border-black border-dotted"></span>
                            )}
                            )
                        </p>
                        <p className="text-sm">ครูประจำชั้น/ครูที่ปรึกษา</p>
                    </div>

                    <div className="text-center">
                        <p className="text-sm">
                            ลงชื่อ{" "}
                            <span className="inline-block w-48 border-b border-black border-dotted"></span>
                        </p>
                        <p className="text-sm">
                            (
                            {allsign?.headOfSubject ? (
                                <span className="px-2 w-48 text-center">
                                    {allsign.headOfSubject}
                                </span>
                            ) : (
                                <span className="inline-block w-48 border-b border-black border-dotted"></span>
                            )}
                            )
                        </p>
                        <p className="text-sm">หัวหน้างานวิชาการโรงเรียน</p>
                    </div>

                    <div className="text-center">
                        <p className="text-sm">
                            ลงชื่อ{" "}

                            <span className="inline-block w-48 border-b border-black border-dotted"></span>

                        </p>
                        <p className="text-sm">
                            (
                            {allsign?.principal ? (
                                <span className="px-2 w-48 text-center">
                                    {allsign.principal}
                                </span>
                            ) : (
                                <span className="inline-block w-48 border-b border-black border-dotted"></span>
                            )}
                            )
                        </p>
                        <p className="text-sm">ผู้อำนวยการโรงเรียน</p>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm">
                            ลงชื่อ{" "}
                            <span className="inline-block w-48 border-b border-black border-dotted"></span>
                        </p>
                        <p className="text-sm mt-2">
                            (<span className="inline-block w-48 border-b border-black border-dotted"></span>)
                        </p>
                        <p className="text-sm">ผู้ปกครองนักเรียน</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CWTemplate2;