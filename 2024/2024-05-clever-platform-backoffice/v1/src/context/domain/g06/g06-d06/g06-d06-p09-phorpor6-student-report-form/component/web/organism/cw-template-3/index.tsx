import { TSubjectType, TTemplateProps } from "@domain/g06/g06-d06/local/types/student-report-form";
import { safeJsonParse } from "@domain/g06/g06-d07/g06-d07-p03-setting-form-template/components/page/form-template";
import { roundNumber } from "@global/utils/number";
import { defaultTo } from "lodash";
import React from "react";

// million-ignore
const CWTemplate3 = ({
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
        width: '210mm', // ความกว้างของ A4
        minHeight: '297mm', // ความสูงของ A4
        padding: '20px',
    };


    // สมรรถนะ
    const capacityData = generals?.filter(d => d.generalType === 'สมรรถนะ');
    // กิจกรรมพัฒนาผู้เรียน
    const activityData = generals?.filter(d => d.generalType === 'กิจกรรมพัฒนาผู้เรียน');
    // คุณลักษณะอันพึงประสงค์
    const characteristicData = generals?.filter(d => d.generalType === 'คุณลักษณะอันพึงประสงค์');

    if (!characteristicData) return
    if (!activityData) return

    // คุณลักษณะ
    const characteristicValue = characteristicData?.map((character, index) => {
        return character.studentIndicatorData?.find(
            d => d.indicatorGeneralName === 'ผลประเมินคุณลักษณะอันพึงประสงค์'
        )?.value;
    });
    // การอ่าน คิด วิเคราะห์
    const readingValue = characteristicData?.map((character, index) => {
        return character.studentIndicatorData?.find(
            d => d.indicatorGeneralName === 'ผลประเมินคุณลักษณะอันพึงประสงค์'
        )?.value;
    });
    const getSubjectTypeText = (type: TSubjectType | undefined) => {
        switch (type) {
            case TSubjectType.PRIMARY:
                return 'พื้นฐาน';
            case TSubjectType.EXTRA:
                return 'เพิ่มเติม';
            default:
                return '-';
        }
    };
    return (
        <div className="p-5 shadow-md border bg-white mb-6" style={pageBgStyle}>
            <div
                style={{
                    backgroundColor: colourSetting?.position3 || '',
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
                                    <span className="text-gray-500 text-xs text-center"></span>
                                </div>
                            )}
                        </div>

                        <h2 className="text-[16px] font-bold">แบบรายงานประจำตัวนักเรียน : ผลการพัฒนาคุณภาพผู้เรียนรายบุคคล(ปพ.6)</h2>
                        <p className="text-[14px]">
                            {school?.name} {school?.area}
                        </p>
                        <p className="text-[14px]">
                            ชั้น {studentData?.year} ปีการศึกษา {studentData?.academic_year}
                        </p>
                    </div>
                </div>
            </div>

            {/* Student Info */}
            <div className="w-full grid grid-cols-3 gap-5 px-20 mb-4 text-sm mt-5 justify-center items-center">
                <div className='col-span-1 flex gap-5'>
                    <div><strong>ชื่อ:</strong> {studentData?.fullname}</div>
                </div>

                <div className='col-span-2 flex gap-5 justify-end'>
                    <div><strong>เลขประจำตัว:</strong> {studentData?.idNo}</div>
                    <strong>เลขที่:</strong> {studentData?.studentNo}
                </div>
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
            <div className="w-full mb-6 relative">
                <table className="w-full border border-gray-300">
                    <thead>
                        <tr style={{ backgroundColor: colourSetting?.position1 || '#fff' }}>
                            <th className="border border-gray-300 p-2 text-center w-20">รหัสวิชา</th>
                            <th className="border border-gray-300 p-2 text-center w-20">กลุ่มสาระ<br />การเรียนรู้</th>
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
                        {defaultTo(studentDetail?.dataJson?.subject, []).map((subject, index) => (
                            <tr key={index}>
                                {/* รหัสวิชา */}
                                <td className="border border-gray-300 !p-1.5">{subject.subjectCode || '-'}</td>
                                {/* กลุ่มสาระการเรียนรู้	 */}
                                <td className="border border-gray-300 !p-1.5">{subject.subjectName || '-'}</td>
                                {/* // TODO : รอ api ประเภท */}
                                <td className="border border-gray-300 !p-1.5 text-center"> {getSubjectTypeText(subject?.type)}</td>
                                {/* หน่วยกิต */}
                                <td className="border border-gray-300 !p-1.5 text-center" >{subject.credits || '-'}</td>
                                {/* คะแนนเต็ม */}
                                <td className="border border-gray-300 !p-1.5 text-center">{subject.totalScore || 0}</td>
                                {/* เฉลี่ยในชั้นเรียน */}
                                <td className="border border-gray-300 !p-1.5 text-center" >
                                    {subject.avgScore ? roundNumber(subject.avgScore) : '0'}
                                </td>
                                {/* คะแนนที่ได้ */}
                                <td className="border border-gray-300 !p-1.5 text-center">{summary?.score || '0'}</td>
                                {/* คุณลักษณะ */}
                                <td className="border border-gray-300 !p-1.5 text-center">{characteristicValue}</td>
                                {/* อ่านคิดวิเคราะห์ */}
                                <td className="border border-gray-300 !p-1.5 text-center">{readingValue}</td>
                                {/* หมายเหตุ */}
                                <td className="border border-gray-300 !p-1.5 text-center">{subject.note || '-'}</td>
                            </tr>
                        ))}
                        {/* แสดงกิจกรรมพัฒนาผู้เรียน */}
                        {/* {activityData?.map((activity, index) => (
                            activity.studentIndicatorData?.map((indicator, idx) => (
                                <tr key={`activity-${index}-${idx}`}>
                                    <td className="border border-gray-300 !p-1.5">-</td>
                                    <td className="border border-gray-300 !p-1.5">{indicator.indicatorGeneralName}</td>
                                    <td className="border border-gray-300 !p-1.5 text-center">กิจกรรม</td>
                                    <td className="border border-gray-300 !p-1.5 text-center">
                                        {indicator.value === 1 ? "ผ" : "มส"}
                                    </td>
                                    <td className="border border-gray-300 !p-1.5 text-center"></td>
                                    <td className="border border-gray-300 !p-1.5 text-center"></td>
                                    <td className="border border-gray-300 !p-1.5 text-center"></td>
                                    <td className="border border-gray-300 !p-1.5 text-center"></td>
                                    <td className="border border-gray-300 !p-1.5 text-center"></td>
                                    <td className="border border-gray-300 !p-1.5 text-center"></td>

                                </tr>
                            ))
                        ))} */}

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
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Summary Section - 2 Columns Layout */}
            <div className="w-full flex mt-5">
                {/* Left Column: Summary Table */}
                <div className="w-full">
                    <div>
                        <table className="w-full text-xs border-collapse border border-gray-300"
                            style={{
                                backgroundColor: colourSetting?.position2 || colourSetting?.position1 || '#fff',
                            }}
                        >
                            <thead>
                                <tr style={{
                                    backgroundColor: colourSetting?.position2 || colourSetting?.position1 || '#fff',
                                }}
                                >
                                    <th className="border-t border-l border-r border-gray-300 py-3 text-center font-bold pt-5 relative" colSpan={1}>
                                        <p className='text-center'>สรุปผลการเรียนตลอดหลักสูตร</p>
                                    </th>
                                    <th className="border border-gray-300 py-3 text-center font-bold" colSpan={2}>
                                        ผลการเรียน
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 !p-1">จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐาน</td>
                                    {/* TODO: imprement normal_credits */}
                                    <td className="border border-gray-300 !p-1 text-center" >{grades?.normal_credits || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติม</td>
                                    {/* TODO: imprement extra_credits */}
                                    <td className="border border-gray-300 !p-1 text-center">{grades?.extra_credits || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">รวมหน่วยกิต/น้ำหนัก</td>
                                    {/* TODO: imprement total_credits */}
                                    <td className="border border-gray-300 !p-1 text-center"> {grades?.total_credits || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ระดับผลการเรียนเฉลี่ย(GPA)</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>
                                        <p>{grades?.avgLearnScore || 0}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการประเมินคุณลักษณะอันพึงประสงค์*</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>
                                        {characteristicData?.length > 0 ?
                                            (characteristicData[0]?.studentIndicatorData?.find(d => d.indicatorGeneralName === 'ผลประเมินคุณลักษณะอันพึงประสงค์')?.value === 1 ? "ผ่าน" : "ไม่ผ่าน")
                                            : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการประเมินการอ่าน คิดวิเคราห์ และเขียน</td>
                                    <td className="border border-gray-300 !p-1 text-center" colSpan={2}>
                                        {characteristicData?.length > 0 ?
                                            (characteristicData[0]?.studentIndicatorData?.find(d => d.indicatorGeneralName === 'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-5')?.value === 1 ? "ผ่าน" : "ไม่ผ่าน")
                                            : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการประเมินกิจกรรมพัฒนาผู้เรียน</td>
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

export default CWTemplate3;