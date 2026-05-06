import Box from '@component/web/atom/Box';
import CWButton from '@component/web/cw-button';
import HorizonTextInput from '@domain/g06/g06-d06/local/component/web/atom/HorizonTextInput';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';

import { Center, Flex, Grid, Group, Space, Text } from '@mantine/core';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import useStore from '@domain/g06/g06-d06/local/stores';
import { defaultTo } from 'lodash';
import { NumeralFormat } from '@domain/g06/g06-d06/local/utils/numeral-format';
import { studentDetailSelectors } from '@domain/g06/g06-d06/local/stores/student-detail';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Phorpor6Template from '@domain/g06/g06-d06/local/component/web/organism/pdf-template/phorpor6';
import { roundNumber } from '@global/utils/number';

interface Phorpor6DocumentProps {
  form: UseFormReturn<FieldValues>;
}

const Phorpor6Document: React.FC<Phorpor6DocumentProps> = (props) => {
  const { studentDetail } = useStore.studentDetail();
  const grades = useStore.studentDetail(studentDetailSelectors.getGrade);
  const gradespr6 = useStore.studentDetail(studentDetailSelectors.getGeneralPhorpor6);
  // สมรถถนะ
  const capacityData = gradespr6?.filter(d => d.generalType === 'สมรรถนะ')
  // กิจกรรมพัฒนาผู้เรียน
  const activityData = gradespr6?.filter(d => d.generalType === 'กิจกรรมพัฒนาผู้เรียน');
  // คุณลักษณะอันพึงประสงค์
  const characteristicData = gradespr6?.filter(d => d.generalType === 'คุณลักษณะอันพึงประสงค์');

  const school = useStore.studentDetail(studentDetailSelectors.getSchool);
  const generals =
    useStore.studentDetail(studentDetailSelectors.getGeneralPhorpor6) || [];
  const allsign = useStore.studentDetail(studentDetailSelectors.getAllSign);

  const student = useStore.studentDetail(studentDetailSelectors.getPhorpor6Form)

  const summary = defaultTo(studentDetail?.dataJson.subject, []).reduce(
    (acc, current) => {
      acc.hours += Number(current.hours);
      acc.totalScore += Number(current.totalScore);
      acc.avgScore += Number(current.avgScore);
      acc.score += Number(current.score);
      return acc;
    },
    {
      hours: 0,
      totalScore: 0,
      avgScore: 0,
      score: 0,
    },
  );
  const { form } = props;

  return (
    <Box>
      <PDFDownloadLink
        document={<Phorpor6Template student={studentDetail} generals={generals} grades={grades} />}
        fileName="ปพ6.pdf"
      >
        {({ blob, url, loading, error }) => {
          return loading ? (
            'กำลังสร้างเอกสาร PDF...'
          ) : (
            <CWButton
              variant={'primary'}
              title={'PDF'}
              disabled={false}
              className={'w-[100px]'}
              icon={<IconUpload />}
            />
          );
        }}
      </PDFDownloadLink>

      <Space h="lg" />

      <div className="max-w-4xl bg-[#FFCCFF] p-6">
        {/* Header */}
        <Center>
          <Flex direction={'column'} align={'center'} justify={'center'} gap="xs">
            <Text fw={700} size="lg">
              แบบรายงานประจำตัวนักเรียน : ผลการพัฒนาคุณภาพผู้เรียนรายบุคคล(ปพ.6)
            </Text>

            <Text fw={700} size="sm">
              {school?.name}
              {school?.area}
            </Text>

            <Text fw={700} size="sm">
              ชั้น {student?.year} ปีการศึกษา{' '}
              {student?.academic_year}
            </Text>
          </Flex>
        </Center>
        <Space h="xl" />
        {/* Student Info */}
        <Group>
          <HorizonTextInput name="fullname" control={form.control} label="ชื่อ-สกุล" />
          <HorizonTextInput
            name="idNo"
            control={form.control}
            label="เลขประจำตัว"
            inputSize="md"
          />
          <HorizonTextInput
            name="studentNo"
            control={form.control}
            label="เลขที่"
            inputSize="sm"
          />
        </Group>
        {/* Grade Table */}
        <div className="py-6">
          <div className="shadow-md">
            <table className="w-full border-collapse">
              <colgroup>
                <col style={{ width: '8%' }} />
                <col style={{ width: '10%' }} />   {/* รหัสวิชา */}
                <col style={{ width: '20%' }} />  {/* รายวิชา - กว้างขึ้น */}
                <col style={{ width: '10%' }} />  {/* เวลาเรียน */}
                <col style={{ width: '10%' }} />  {/* คะแนนเต็ม */}
                <col style={{ width: '10%' }} />  {/* เฉลี่ย */}
                <col style={{ width: '10%' }} />  {/* คะแนนที่ได้ */}
                <col style={{ width: '10%' }} />  {/* ผลการเรียน */}
                <col style={{ width: '12%' }} />  {/* หมายเหตุ */}
              </colgroup>
              <tbody>
                <tr>
                  <td rowSpan={15} className="relative w-8 border border-black">
                    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                      <div className="-rotate-90 transform text-nowrap text-center">
                        ผลการเรียนรายวิชา
                      </div>
                    </div>
                  </td>
                  <th className="border border-black text-center font-normal">
                    รหัสวิชา
                  </th>
                  <th className="border border-black  text-center font-normal">
                    รายวิชา
                  </th>
                  <th className="border border-black  text-center font-normal">
                    เวลาเรียน
                    <br />
                    (ชั่วโมง/ปี)
                  </th>
                  <th className="border border-black  text-center font-normal">
                    คะแนน
                    <br />
                    เต็ม
                  </th>
                  <th className="border border-black  text-center font-normal">
                    เฉลี่ย
                    <br />
                    ในชั้นเรียน
                  </th>
                  <th className="border border-black  text-center font-normal">
                    คะแนน
                    <br />
                    ที่ได้
                  </th>
                  <th className="border border-black  text-center font-normal">
                    ผล
                    <br />
                    การเรียน
                  </th>

                  <th className="border border-black  text-center font-normal">
                    หมายเหตุ
                  </th>
                </tr>
                {defaultTo(studentDetail?.dataJson.subject, []).map((subject, index) => (
                  <tr key={index} className="">
                    <td className="border border-black !px-4 !py-1.5">
                      {subject.subjectCode}
                    </td>
                    <td className="w-24 border border-black !px-4 !py-1.5" >
                      {subject.subjectName}
                    </td>
                    <td className="border border-black !px-4 !py-1.5 text-center">
                      {subject.hours}
                    </td>
                    <td className="border border-black !px-4 !py-1.5 text-center">
                      {subject.totalScore}
                    </td>
                    <td className="border border-black !px-4 !py-1.5 text-center">
                      {NumeralFormat.formatDecimal(subject.avgScore)}
                    </td>
                    <td className="border border-black !px-4 !py-1.5 text-center">
                      {subject.score}
                    </td>
                    <td className="border border-black !px-4 !py-1.5 text-center">
                      {NumeralFormat.formatDecimal(subject.grade)}
                    </td>
                    <td className="border border-black !px-4 !py-1.5 text-center">
                      {subject.note}
                    </td>
                  </tr>
                ))}
                {/* Empty rows */}
                {[1, 2, 3].map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td className="border border-black !px-4 !py-1.5">&nbsp;</td>
                    <td className="border border-black !px-4 !py-1.5">&nbsp;</td>
                    <td className="border border-black !px-4 !py-1.5">&nbsp;</td>
                    <td className="border border-black !px-4 !py-1.5">&nbsp;</td>
                    <td className="border border-black !px-4 !py-1.5">&nbsp;</td>
                    <td className="border border-black !px-4 !py-1.5">&nbsp;</td>
                    <td className="border border-black !px-4 !py-1.5">&nbsp;</td>
                    <td className="border border-black !px-4 !py-1.5">&nbsp;</td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="">
                  <td
                    colSpan={2}
                    className="border border-black !px-4 !py-1.5 text-center font-medium"
                  >
                    รวม
                  </td>
                  <td className="border border-black !px-4 !py-1.5 text-center font-medium">
                    {summary.hours}
                  </td>
                  <td className="border border-black !px-4 !py-1.5 text-center font-medium">
                    {summary.totalScore}
                  </td>
                  <td className="border border-black !px-4 !py-1.5 text-center font-medium">
                    {NumeralFormat.formatDecimal(summary.avgScore)}
                  </td>
                  <td className="border border-black !px-4 !py-1.5 text-center font-medium">
                    {summary.score}
                  </td>
                  <td className="border border-black !px-4 !py-1.5 text-center font-medium">-</td>
                  <td className="border border-black !px-4 !py-1.5 text-center font-medium">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Grid>
          <Grid.Col span={8}>
            <Grid gutter="lg">
              <Grid.Col span={12}>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td colSpan={12} className="border border-black !px-4 !py-1.5">
                        คะแนนคิดเป็นร้อยละ
                      </td>
                      <td className="w-32 border border-black text-center !px-4 !py-1.5">
                        {roundNumber(Number(grades?.scorePercentage))}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={12} className="border border-black !px-4 !py-1.5">
                        คะแนนรวมได้ลำดับที่
                      </td>
                      <td className="w-32 border border-black text-center !px-4 !py-1.5">
                        {grades?.totalScoreRank}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={12} className="border border-black !px-4 !py-1.5">
                        ผลการเรียนเฉลี่ย
                      </td>
                      <td className="w-32 border border-black text-center !px-4 !py-1.5">
                        {grades?.avgLearnScore}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={12} className="border border-black !px-4 !py-1.5">
                        ผลการเรียนเฉลี่ยได้ลำดับที่
                      </td>
                      <td className="w-32 border border-black text-center !px-4 !py-1.5">
                        {grades?.avgLearnRank}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={12} className="border border-black !px-4 !py-1.5">
                        จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐาน
                      </td>
                      <td className="w-32 border border-black text-center !px-4 !py-1.5">
                        {grades?.normal_credits}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={12} className="border border-black !px-4 !py-1.5">
                        จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติม
                      </td>
                      <td className="w-32 border border-black text-center !px-4 !py-1.5">
                        {grades?.extra_credits}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={12} className="border border-black !px-4 !py-1.5">
                        รวมหน่วยกิต/น้ำหนัก
                      </td>
                      <td className="w-32 border border-black text-center !px-4 !py-1.5">
                        {grades?.total_credits}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Grid.Col>
              {activityData?.map((g) => {
                return (
                  <Grid.Col key={g.evaluationStudentId} span={12}>
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr>
                          <td colSpan={12} className="border border-black !px-4 !py-1.5">
                            ผลการประเมินกิจกรรมพัฒนาผู้เรียน
                          </td>
                        </tr>

                        {g.studentIndicatorData
                          // .filter(d => d.indicatorGeneralName === 'competency-6')
                          .map((d, i) => {
                            console.log(`General ${g.evaluationStudentId} - Indicator ${i}:`, d);

                            return (
                              <tr
                                key={`${g.evaluationStudentId}.${d.indicatorGeneralName}.${i}`}
                              >
                                <td className="border border-black !px-4 !py-1.5">
                                  {d.indicatorGeneralName}
                                </td>
                                <td className="w-32 border border-black text-center !px-4 !py-1.5">
                                  {d.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </Grid.Col>
                );
              })}

              {characteristicData?.map((g) => {
                return (
                  <Grid.Col key={g.evaluationStudentId} span={12}>
                    <table className="w-full border-collapse">
                      <tbody>

                        {g.studentIndicatorData
                          .filter(d => d.indicatorGeneralName === 'ผลประเมินคุณลักษณะอันพึงประสงค์')
                          .map((d, i) => {
                            console.log(`General ${g.evaluationStudentId} - Indicator ${i}:`, d);

                            return (
                              <tr
                                key={`${g.evaluationStudentId}.${d.indicatorGeneralName}.${i}`}
                              >
                                <td className="border border-black !px-4 !py-1.5">
                                  {d.indicatorGeneralName}
                                </td>
                                <td className="w-32 border border-black text-center !px-4 !py-1.5">
                                  {d.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                                </td>
                              </tr>
                            );
                          })}
                        {g.studentIndicatorData
                          .filter(d => d.indicatorGeneralName === 'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-5')
                          .map((d, i) => {
                            console.log(`General ${g.evaluationStudentId} - Indicator ${i}:`, d);

                            return (
                              <tr
                                key={`${g.evaluationStudentId}.${d.indicatorGeneralName}.${i}`}
                              >
                                <td className="border border-black !px-4 !py-1.5">
                                  ผลการประเมินการอ่าน คิดวิเคราะห์และเขียน
                                </td>
                                <td className="w-32 border border-black text-center !px-4 !py-1.5">
                                  {d.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                                </td>
                              </tr>
                            );
                          })}
                        {capacityData?.map(g => {
                          const competency6 = g.studentIndicatorData.find(
                            d => d.indicatorGeneralName === "competency-6"
                          );

                          return competency6 ? (
                            <tr key={`${g.evaluationStudentId}.${competency6.indicatorGeneralName}`}>
                              <td className="border border-black !px-4 !py-1.5">
                                ผลการประเมินสมรรถนะสำคัญจของผู้เรียน
                              </td>
                              <td className="w-32 border border-black text-center !px-4 !py-1.5">
                                {competency6.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                              </td>
                            </tr>
                          ) : null;
                        })}
                      </tbody>
                    </table>
                  </Grid.Col>
                );
              })}

            </Grid>
          </Grid.Col>
          <Grid.Col span={4} className="mt-10">
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              gap="xs"
              className="py-6"
            >
              <Text size="sm" fw={400}>
                ลงชื่อ...................................................
              </Text>
              <Text size="sm" fw={400}>
                {`(${allsign?.subjectTeacher})`}
              </Text>
              <Text size="sm" fw={400}>
                ครูประจำชั้น/ครูที่ปรึกษา
              </Text>
            </Flex>

            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              gap="xs"
              className="py-6"
            >
              <Text size="sm" fw={400}>
                ลงชื่อ...................................................
              </Text>
              <Text size="sm" fw={400}>
                {`(${allsign?.headOfSubject})`}
              </Text>
              <Text size="sm" fw={400}>
                หัวหน้างานวิชาการโรงเรียน
              </Text>
            </Flex>

            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              gap="xs"
              className="py-6"
            >
              <Text size="sm" fw={400}>
                ลงชื่อ...................................................
              </Text>
              <Text size="sm" fw={400}>
                {`(${allsign?.principal})`}
              </Text>
              <Text size="sm" fw={400}>
                ผู้อำนวยการโรงเรียน
              </Text>
            </Flex>

            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              gap="xs"
              className="py-6"
            >
              <Text size="sm" fw={400}>
                ลงชื่อ...................................................
              </Text>
              <Text size="sm" fw={400}>
                (.........................................................)
              </Text>
              <Text size="sm" fw={400}>
                ผู้ปกครองนักเรียน
              </Text>
            </Flex>
          </Grid.Col>
        </Grid>
      </div>
    </Box>
  );
};

export default Phorpor6Document;
