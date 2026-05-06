
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';
import { TSubjectType, TTemplateProps } from '@domain/g06/g06-d06/local/types/student-report-form';
import { safeJsonParse } from '@domain/g06/g06-d07/g06-d07-p03-setting-form-template/components/page/form-template';
import { roundNumber } from '@global/utils/number';
import { defaultTo } from 'lodash';
import { styles } from '../styles';
import { addOpacityToHex } from '@global/utils/addOpacityToHex';


const TableRow = ({ children, style = {} }: any) => (
    <View style={[styles.tableRow, style]}>{children}</View>
);

const TableCell = ({ children, style = {}, width = 'auto', textAlign = 'left' }: any) => (
    <View style={[styles.tableCell, { width }, style]}>
        <Text style={{ textAlign }}>{children}</Text>
    </View>
);

const SummaryRow = ({ children, style = {} }: any) => (
    <View style={[styles.summaryRow, style]}>{children}</View>
);

const SummaryCell = ({ children, style = {}, width = 'auto', textAlign = 'left' }: any) => (
    <View style={[styles.summaryCell, { width }, style]}>
        <Text style={{ textAlign }}>{children}</Text>
    </View>
);

const CWTemplate3PDF = ({
    templateData,
    studentDetail,
    studentData,
    grades,
    generals,
    school,
    allsign,
    summary
}: TTemplateProps) => {

    const colourSetting = safeJsonParse(templateData?.colour_setting) || {};

    const capacityData = generals?.filter(d => d.generalType === 'สมรรถนะ');
    const characteristicData = generals?.filter(d => d.generalType === 'คุณลักษณะอันพึงประสงค์');

    const pageBgStyle = {
        backgroundColor: colourSetting?.position1 || '',
    };

    const headerBgStyle = {
        backgroundColor: colourSetting?.position3 || '',
    };

    const summaryBgStyle = {
        backgroundColor: addOpacityToHex(colourSetting?.position2 || '', 0.5),
    };

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
        <Document>
            <Page size="A4" style={[styles.page, pageBgStyle]}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={[{
                        marginBottom: 5,
                        padding: 10,
                        position: 'relative',

                    }, headerBgStyle,]}>
                        {templateData?.logo_image ? (
                            <View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }]}>
                                <Image
                                    src={
                                        typeof templateData.logo_image === "string"
                                            ? templateData.logo_image
                                            : templateData.logo_image
                                                ? URL.createObjectURL(templateData.logo_image as Blob)
                                                : ""
                                    }
                                    style={{ width: 38, height: 45, }}
                                />
                            </View>
                        ) : (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                }}
                            >
                                <Text
                                    style={{
                                        width: 38,
                                        height: 45,
                                        borderStyle: 'dashed',
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >

                                </Text>
                            </View>
                        )}

                        <View style={[styles.header, { marginTop: 5 }]}>
                            <Text style={styles.title}>แบบรายงานประจำตัวนักเรียน : ผลการพัฒนาคุณภาพผู้เรียนรายบุคคล(ปพ.6)</Text>
                            <Text style={styles.subtitle}>
                                {school?.name} {school?.area}
                            </Text>
                            <Text style={styles.subtitle}>
                                ชั้น {studentData?.year} ปีการศึกษา {studentData?.academic_year}
                            </Text>
                        </View>
                    </View>

                    {/* Student Info */}
                    <View style={styles.studentInfoContainer}>
                        <View style={styles.studentInfoLeft}>
                            <Text>
                                <Text style={{ fontWeight: 'bold' }}>ชื่อ-สกุล</Text> {studentData?.fullname}
                            </Text>
                        </View>
                        <View style={[styles.studentInfoRight]}>
                            <Text>
                                <Text
                                    style={{ fontWeight: 'bold' }}
                                >
                                    เลขประจำตัว
                                </Text> {studentData?.idNo}
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: 'bold', }}>เลขที่</Text> {studentData?.studentNo}
                            </Text>
                        </View>
                    </View>


                    {templateData?.background_image && (
                        <View style={styles.backgroundImage}>
                            <Image
                                src={
                                    typeof templateData.background_image === "string"
                                        ? templateData.background_image
                                        : URL.createObjectURL(templateData.background_image)
                                }
                                style={{ width: 450, height: 450 }}
                            />
                        </View>
                    )}

                    {/* Table: Subject Scores */}
                    <View style={[styles.table, { borderBottomWidth: 0, position: 'relative' }]}>
                        <TableRow>
                            <TableCell width="10%" style={styles.tableHeader} textAlign="center">
                                รหัสวิชา
                            </TableCell>
                            <TableCell width="20%" style={styles.tableHeader} textAlign="center">
                                กลุ่มสาระการเรียนรู้
                            </TableCell>
                            <TableCell width="8%" style={styles.tableHeader} textAlign="center">
                                ประเภท
                            </TableCell>
                            <TableCell width="8%" style={styles.tableHeader} textAlign="center">
                                หน่วยกิต
                            </TableCell>
                            <TableCell width="8%" style={styles.tableHeader} textAlign="center">
                                คะแนนเต็ม
                            </TableCell>
                            <TableCell width="10%" style={styles.tableHeader} textAlign="center">
                                เฉลี่ย{"\n"}ในชั้นเรียน
                            </TableCell>
                            <TableCell width="8%" style={styles.tableHeader} textAlign="center">
                                คะแนนที่ได้
                            </TableCell>
                            <TableCell width="8%" style={styles.tableHeader} textAlign="center">
                                คุณลักษณะ
                            </TableCell>
                            <TableCell width="10%" style={styles.tableHeader} textAlign="center">
                                อ่านคิด{"\n"}วิเคราะห์เขียน
                            </TableCell>
                            <TableCell width="10%" style={styles.tableHeader} textAlign="center">
                                หมายเหตุ
                            </TableCell>
                        </TableRow>

                        {/* Subject Rows */}
                        {defaultTo(studentDetail?.dataJson?.subject, []).map((subject, index) => (
                            <TableRow key={index}>
                                <TableCell width="10%">
                                    {subject.subjectCode || '-'}
                                </TableCell>
                                <TableCell width="20%">
                                    {subject.subjectName || '-'}
                                </TableCell>
                                <TableCell width="8%" textAlign="center">
                                    {getSubjectTypeText(subject?.type)}
                                </TableCell>
                                <TableCell width="8%" textAlign="center">
                                    {subject.credits || '-'}
                                </TableCell>
                                <TableCell width="8%" textAlign="center">
                                    {subject.totalScore || 0}
                                </TableCell>
                                <TableCell width="10%" textAlign="center">
                                    {subject.avgScore ? roundNumber(subject.avgScore) : '0'}
                                </TableCell>
                                <TableCell width="8%" textAlign="center">
                                    {summary?.score || '0'}
                                </TableCell>
                                <TableCell width="8%" textAlign="center">
                                    {characteristicValue}
                                </TableCell>
                                <TableCell width="10%" textAlign="center">
                                    {readingValue}
                                </TableCell>
                                <TableCell width="10%" textAlign="center">
                                    {subject.note || '-'}
                                </TableCell>
                            </TableRow>
                        ))}

                        {/* Empty rows */}
                        {Array.isArray(studentDetail?.dataJson?.subject) && studentDetail.dataJson.subject.length <= 5 &&
                            [1, 2, 3, 4, 5].map((_, index) => (
                                <TableRow key={`empty-${index}`}>
                                    <TableCell width="10%">{' '}</TableCell>
                                    <TableCell width="20%" textAlign="center">{' '}</TableCell>
                                    <TableCell width="8%" textAlign="center">{' '}</TableCell>
                                    <TableCell width="8%" textAlign="center">{' '}</TableCell>
                                    <TableCell width="8%" textAlign="center">{' '}</TableCell>
                                    <TableCell width="10%" textAlign="center">{' '}</TableCell>
                                    <TableCell width="8%" textAlign="center">{' '}</TableCell>
                                    <TableCell width="8%" textAlign="center">{' '}</TableCell>
                                    <TableCell width="10%" textAlign="center">{' '}</TableCell>
                                    <TableCell width="10%" textAlign="center">{' '}</TableCell>
                                </TableRow>
                            ))
                        }
                    </View>

                    {/* Summary Section - 2 Columns Layout */}
                    <View style={styles.contentContainer}>
                        {/* Left Column: Summary Table */}
                        <View style={styles.leftColumn}>
                            {/* Summary Table */}
                            <View style={[styles.summaryTable, summaryBgStyle]}>
                                {/* header */}
                                <SummaryRow style={[{ minHeight: 24, fontWeight: 'bold' },]}>
                                    <SummaryCell
                                        width="70%"
                                        textAlign="center "
                                        style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }]}
                                    >
                                        สรุปผลการเรียนตลอดหลักสูตร
                                    </SummaryCell>
                                    <SummaryCell
                                        width="30%"
                                        textAlign="center"
                                        style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }]}
                                    >
                                        ผลการเรียน
                                    </SummaryCell>
                                </SummaryRow>

                                <SummaryRow>
                                    <SummaryCell width="70%">จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐาน</SummaryCell>
                                    <SummaryCell width="30%" textAlign="center">
                                        {grades?.normal_credits || '-'}
                                    </SummaryCell>
                                </SummaryRow>
                                <SummaryRow>
                                    <SummaryCell width="70%">จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติม</SummaryCell>
                                    <SummaryCell width="30%" textAlign="center">
                                        {grades?.extra_credits || '-'}
                                    </SummaryCell>
                                </SummaryRow>
                                <SummaryRow>
                                    <SummaryCell width="70%">รวมหน่วยกิต/น้ำหนัก</SummaryCell>
                                    <SummaryCell width="30%" textAlign="center">
                                        {grades?.total_credits || '-'}
                                    </SummaryCell>
                                </SummaryRow>
                                <SummaryRow>
                                    <SummaryCell width="70%">ระดับผลการเรียนเฉลี่ย(GPA)</SummaryCell>
                                    <SummaryCell width="30%" textAlign="center">
                                        {grades?.avgLearnScore || '-'}
                                    </SummaryCell>
                                </SummaryRow>
                                {characteristicData?.map((characteristic) => (
                                    characteristic.studentIndicatorData
                                        .filter(d => d.indicatorGeneralName === 'ผลประเมินคุณลักษณะอันพึงประสงค์')
                                        .map((indicator, idx) => (
                                            <SummaryRow key={`char-${characteristic.evaluationStudentId}-${idx}`}>
                                                <SummaryCell width="70%">ผลการประเมินคุณลักษณะอันพึงประสงค์</SummaryCell>
                                                <SummaryCell width="30%" textAlign="center">
                                                    {indicator.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                                                </SummaryCell>
                                            </SummaryRow>
                                        ))
                                ))}

                                {characteristicData?.map((characteristic) => (
                                    characteristic.studentIndicatorData
                                        .filter(d => d.indicatorGeneralName === 'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-5')
                                        .map((indicator, idx) => (
                                            <SummaryRow key={`read-${characteristic.evaluationStudentId}-${idx}`}>
                                                <SummaryCell width="70%">ผลการประเมินการอ่าน คิดวิเคราะห์และเขียน</SummaryCell>
                                                <SummaryCell width="30%" textAlign="center">
                                                    {indicator.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                                                </SummaryCell>
                                            </SummaryRow>
                                        ))
                                ))}

                                {capacityData?.map((capacity) => {
                                    const competency6 = capacity.studentIndicatorData.find(
                                        d => d.indicatorGeneralName === "competency-6"
                                    );

                                    return competency6 ? (
                                        <SummaryRow key={`capacity-${capacity.evaluationStudentId}`}>
                                            <SummaryCell width="70%">ผลการประเมินสมรรถนะสำคัญของผู้เรียน</SummaryCell>
                                            <SummaryCell width="30%" textAlign="center">
                                                {competency6.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                                            </SummaryCell>
                                        </SummaryRow>
                                    ) : null;
                                })}
                            </View>
                        </View>

                        {/* Right Column: Signatures */}
                        <View style={styles.rightColumn}>
                            <View style={styles.signatureBox}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>ลงชื่อ</Text>
                                    <View style={[styles.signatureLine, { width: 150, marginLeft: 4 }]} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                    <Text>(</Text>
                                    {allsign?.subjectTeacher ? (
                                        <Text>{allsign.subjectTeacher}</Text>
                                    ) : (
                                        <View style={[styles.signatureLineFree, { width: 120 }]} />
                                    )}
                                    <Text>)</Text>
                                </View>
                                <Text>ครูประจำชั้น/ครูที่ปรึกษา</Text>
                            </View>

                            <View style={styles.signatureBox}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>ลงชื่อ</Text>
                                    <View style={[styles.signatureLine, { width: 150, marginLeft: 4 }]} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                    <Text>(</Text>
                                    {allsign?.headOfSubject ? (
                                        <Text>{allsign.headOfSubject}</Text>
                                    ) : (
                                        <View style={[styles.signatureLineFree, { width: 120 }]} />
                                    )}
                                    <Text>)</Text>
                                </View>
                                <Text>หัวหน้างานวิชาการโรงเรียน</Text>
                            </View>

                            <View style={styles.signatureBox}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>ลงชื่อ</Text>
                                    <View style={[styles.signatureLine, { width: 150, marginLeft: 4 }]} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                    <Text>(</Text>
                                    {allsign?.principal ? (
                                        <Text>{allsign.principal}</Text>
                                    ) : (
                                        <View style={[styles.signatureLineFree, { width: 120 }]} />
                                    )}
                                    <Text>)</Text>
                                </View>
                                <Text>ผู้อำนวยการโรงเรียน</Text>
                            </View>

                            <View style={styles.signatureBox}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>ลงชื่อ</Text>
                                    <View style={[styles.signatureLine, { width: 150, marginLeft: 4 }]} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                    <Text>(</Text>
                                    <View style={[styles.signatureLineFree, { width: 120 }]} />
                                    <Text>)</Text>
                                </View>
                                <Text>ผู้ปกครองนักเรียน</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default CWTemplate3PDF;