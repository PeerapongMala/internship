import { TTemplateProps } from "@domain/g06/g06-d06/local/types/student-report-form";
import { safeJsonParse } from "@domain/g06/g06-d07/g06-d07-p03-setting-form-template/components/page/form-template";
import { roundNumber, roundNumberForString } from "@global/utils/number";
import { defaultTo } from "lodash";

// million-ignore
const CWTemplate1 = ({
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

    // จัดการพื้นหลัง
    const pageBgStyle: React.CSSProperties = {
        backgroundColor: colourSetting?.position1 || '',
        width: '210mm',
        minHeight: '297mm',
    };

    // สมรถถนะ
    const capacityData = generals?.filter(d => d.generalType === 'สมรรถนะ')
    // กิจกรรมพัฒนาผู้เรียน
    const activityData = generals?.filter(d => d.generalType === 'กิจกรรมพัฒนาผู้เรียน');
    // คุณลักษณะอันพึงประสงค์
    const characteristicData = generals?.filter(d => d.generalType === 'คุณลักษณะอันพึงประสงค์');

    return (
        <div className="p-5 shadow-md border bg-white mb-6" style={pageBgStyle}>
            <div
                style={{
                    backgroundColor: colourSetting?.position3 || '',
                }}>
                <div className='p-5 relative'>
                    {/* Header */}
                    <div className="text-center mb-4">
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
            <div className="w-full grid grid-cols-3 gap-5 px-20 mb-4 mt-5 text-sm justify-center items-center">
                <div className='col-span-2 flex gap-5'>
                    <div><strong>ชื่อ-สกุล:</strong> {studentData?.fullname}</div>
                </div>
                <div className='col-span-1 flex gap-5'>
                    <div><strong>เลขประจำตัว:</strong> {studentData?.idNo}</div>
                    <div><strong>เลขที่:</strong> {studentData?.studentNo}</div>
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
            <div className="overflow-x-auto mb-6 relative">
                <table className="w-full border border-gray-300">
                    <colgroup>
                        <col style={{ width: '4%' }} />
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '22%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '12%' }} />
                    </colgroup>
                    <tbody>
                        <tr style={{
                            backgroundColor: colourSetting?.position3 || '',
                        }}>
                            <td rowSpan={15} className="relative w-8 border border-gray-300">
                                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                                    <div className="-rotate-90 transform text-nowrap text-center">
                                        ผลการเรียนรายวิชา
                                    </div>
                                </div>
                            </td>
                            <th className="border border-gray-300 !p-1.5 text-center font-normal">รหัสวิชา</th>
                            <th className="border border-gray-300 !p-1.5 text-center font-normal">รายวิชา</th>
                            <th className="border border-gray-300 !p-1.5 text-center font-normal">เวลาเรียน<br />(ชั่วโมง/ปี)</th>
                            <th className="border border-gray-300 !p-1.5 text-center font-normal">คะแนน<br />เต็ม</th>
                            <th className="border border-gray-300 !p-1.5 text-center font-normal">เฉลี่ย<br />ในชั้นเรียน</th>
                            <th className="border border-gray-300 !p-1.5 text-center font-normal">คะแนน<br />ที่ได้</th>
                            <th className="border border-gray-300 !p-1.5 text-center font-normal">ผล<br />การเรียน</th>
                            <th className="border border-gray-300 !p-1.5 text-center font-normal">หมายเหตุ</th>
                        </tr>

                        {defaultTo(studentDetail?.dataJson?.subject, []).map((subject, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 !p-1.5">{subject.subjectCode || '-'}</td>
                                <td className="border border-gray-300 !p-1.5">{subject.subjectName || '-'}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{subject.hours || '-'}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">{subject.totalScore || '-'}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">
                                    {subject.avgScore ? roundNumber(subject.avgScore) : '0'}
                                </td>
                                <td className="border border-gray-300 !p-1.5 text-center">{subject.score || '0'}</td>
                                <td className="border border-gray-300 !p-1.5 text-center">
                                    {roundNumberForString(subject.grade) || '0'}
                                </td>
                                <td className="border border-gray-300 !p-1.5 text-center">{subject.note || ''}</td>
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
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                    <td className="border border-gray-300 !p-1.5">&nbsp;</td>
                                </tr>
                            ))
                        }

                        {/* Total row */}
                        <tr>
                            <td colSpan={2} className="border border-gray-300 !p-1.5 text-center font-medium">รวม</td>
                            <td className="border border-gray-300 !p-1.5 text-center font-medium">{summary?.hours || '-'}</td>
                            <td className="border border-gray-300 !p-1.5 text-center font-medium">{summary?.totalScore || '-'}</td>
                            <td className="border border-gray-300 !p-1.5 text-center font-medium">
                                {summary?.avgScore ? roundNumber(summary.avgScore) : '-'}
                            </td>
                            <td className="border border-gray-300 !p-1.5 text-center font-medium">{summary?.score || '-'}</td>
                            <td className="border border-gray-300 !p-1.5 text-center font-medium">-</td>
                            <td className="border border-gray-300 !p-1.5 text-center font-medium"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Summary Section - 2 Columns Layout */}
            <div className="w-full flex mt-5">
                {/* Left Column: Summary Table */}
                <div className="w-full pr-4">
                    <div>
                        <table className="w-full text-sm border-collapse border border-gray-300">
                            <tbody style={{ backgroundColor: colourSetting?.position2 || '' }}>
                                <tr className="text-sm">
                                    <td className="border border-gray-300 !p-1">คะแนนคิดเป็นร้อยละ</td>
                                    <td className="border border-gray-300 !p-1 text-center w-20">
                                        {grades?.scorePercentage ? Math.round(Number(grades.scorePercentage)) : 0}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">คะแนนรวมได้ลำดับที่</td>
                                    <td className="border border-gray-300 !p-1 text-center">{grades?.totalScoreRank || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการเรียนเฉลี่ย</td>
                                    <td className="border border-gray-300 !p-1 text-center">{grades?.avgLearnScore || 0}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">ผลการเรียนเฉลี่ยได้ลำดับที่</td>
                                    <td className="border border-gray-300 !p-1 text-center">{grades?.avgLearnRank || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐาน</td>
                                    <td className="border border-gray-300 !p-1 text-center">{grades?.normal_credits || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติม</td>
                                    <td className="border border-gray-300 !p-1 text-center">{grades?.extra_credits || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 !p-1">รวมหน่วยกิต/น้ำหนัก</td>
                                    <td className="border border-gray-300 !p-1 text-center">{grades?.total_credits || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Activity Evaluation */}
                    <div className='w-full mt-5'>
                        <table className="w-full text-sm border-collapse border border-gray-300">
                            <tbody style={{ backgroundColor: colourSetting?.position2 || '' }}>
                                <tr>
                                    <td className="border border-gray-300 !p-1 text-sm" colSpan={2}>ผลการประเมินกิจกรรมพัฒนาผู้เรียน</td>
                                </tr>
                                {activityData?.map((activity) => (
                                    activity.studentIndicatorData.map((indicator, idx) => (
                                        <tr key={`activity-${activity.evaluationStudentId}-${idx}`}>
                                            <td className="border border-gray-300 !p-1">{indicator.indicatorGeneralName}</td>
                                            <td className="border border-gray-300 !p-1 text-center w-20">
                                                {indicator.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                                            </td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Characteristic Evaluation */}
                    <div className='w-full mt-5'>
                        <table className="w-full text-sm border-collapse border border-gray-300">
                            <tbody style={{ backgroundColor: colourSetting.position2 || '' }}>
                                {characteristicData?.map((characteristic) => (
                                    characteristic.studentIndicatorData
                                        .filter(d => d.indicatorGeneralName === 'ผลประเมินคุณลักษณะอันพึงประสงค์')
                                        .map((indicator, idx) => (
                                            <tr key={`char-${characteristic.evaluationStudentId}-${idx}`}

                                            >
                                                <td className="border border-gray-300 !p-1">ผลการประเมินคุณลักษณะอันพึงประสงค์</td>
                                                <td className="border border-gray-300 !p-1 text-center w-20">
                                                    {indicator.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                                                </td>
                                            </tr>
                                        ))
                                ))}

                                {characteristicData?.map((characteristic) => (
                                    characteristic.studentIndicatorData
                                        .filter(d => d.indicatorGeneralName === 'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-5')
                                        .map((indicator, idx) => (
                                            <tr key={`read-${characteristic.evaluationStudentId}-${idx}`}>
                                                <td className="border border-gray-300 !p-1">ผลการประเมินการอ่าน คิดวิเคราะห์และเขียน</td>
                                                <td className="border border-gray-300 !p-1 text-center w-20">
                                                    {indicator.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                                                </td>
                                            </tr>
                                        ))
                                ))}

                                {capacityData?.map((capacity) => {
                                    const competency6 = capacity.studentIndicatorData.find(
                                        d => d.indicatorGeneralName === "competency-6"
                                    );

                                    return competency6 ? (
                                        <tr key={`capacity-${capacity.evaluationStudentId}`}>
                                            <td className="border border-gray-300 !p-1">ผลการประเมินสมรรถนะสำคัญของผู้เรียน</td>
                                            <td className="border border-gray-300 !p-1 text-center w-20">
                                                {competency6.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                                            </td>
                                        </tr>
                                    ) : null;
                                })}
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

export default CWTemplate1;