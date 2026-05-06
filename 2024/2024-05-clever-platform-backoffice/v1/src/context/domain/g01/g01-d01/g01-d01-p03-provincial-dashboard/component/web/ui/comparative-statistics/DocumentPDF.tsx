import React, { FC } from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
  Canvas,
} from '@react-pdf/renderer';
import { StudentDetailDto } from '@domain/g06/g06-d06/local/type';
import { defaultTo } from 'lodash';
import { TreeDistrict } from '@domain/g01/g01-d01/local/api/group/provincial-dashboard/type';

Font.register({
  family: 'THSarabun',
  fonts: [
    {
      src: '/public/font/THSarabun/SarabunRegular.ttf',
      fontWeight: 400,
    },
    {
      src: '/public/font/THSarabun/SarabunBold.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFCCFF',
    padding: 24,
    flexDirection: 'column',
    fontFamily: 'THSarabun',
    textOverflow: 'ellipsis',
    fontSize: 16,
  },

  container: {
    width: '100%',
    padding: 0,
    marginBottom: 10,
  },

  borderBottom: {
    borderBottom: '1px solid black',
  },

  textCenter: {
    textAlign: 'center',
    fontSize: 16,
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexWrap: {
    flexWrap: 'wrap',
  },

  textBold: {
    fontWeight: 700,
  },
  textLeft: {
    textAlign: 'left',
  },

  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableRowHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    flexGrow: 1,
  },
  tableCellLast: {
    borderRightWidth: 0,
  },
});

const tableStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 16,
    fontFamily: 'THSarabun',
    fontSize: 12,
    background: 'white',
  },
});
type RenderAccordingProps = {
  item: TreeDistrict;
  level: number;
  indexId: string;
};
const RenderAccording: FC<RenderAccordingProps> = ({ item, level, indexId }) => {
  return (
    <View>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
      >
        <View
          style={{
            width: '46%',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingLeft: `${level * 4}px`,
          }}
        >
          <Text style={[{ fontWeight: 'bold', fontSize: 12 }]}> {/* {item.Name} */}</Text>
        </View>
        <View
          style={{
            width: '18%',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Text style={[{ fontSize: 12, fontWeight: 300 }]}>
            คะแนนสูงสุด:{(item.max_star_count ?? 0).toFixed(2)}
            {/* คะแนนสูงสุด:{item.MaxStarCount.toFixed(2)} */}
          </Text>
        </View>
        <View
          style={{
            width: '18%',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Text style={[{ fontSize: 12, fontWeight: 300 }]}>
            คะแนนเฉลี่ย:{(item.avg_star_count ?? 0).toFixed(2)}
            {/* คะแนนเฉลี่ย:{item.AvgStarCount.toFixed(2)} */}
          </Text>
        </View>
        <View
          style={{
            width: '18%',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Text style={[{ fontSize: 12, fontWeight: 300 }]}>
            ด่านที่ผ่านเฉลี่ย:{(item.avg_pass_level ?? 0).toFixed(2)}
            {/* ด่านที่ผ่านเฉลี่ย:{item.AvgPassLevel.toFixed(2)} */}
          </Text>
        </View>
      </View>
      {item.children && item.children.length ? (
        <View style={{ width: '100%' }}>
          {item.children?.map((child, index) => (
            <RenderAccording
              key={'level' + level + indexId + index}
              // key={"level" + level + child.SchoolId + child.ClassRoomId + child.Name}
              item={child}
              level={level + 1}
              indexId={indexId}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};
type Overview = {
  province: string;
  highestAreaScore: number;
  averageAreaScore: number;
  lowestScore: number;
  averageScore: number;
  highestScore: number;
};
type Props = {
  student: StudentDetailDto | null;
  overview: Overview;
  imageBarUrl: string;
  imageDonutUrl: string;
  data: TreeDistrict[];
};
const DocumentPDF = ({ student, overview, imageBarUrl, imageDonutUrl, data }: Props) => {
  return (
    <Document>
      <Page size="A4" style={tableStyles.page} wrap>
        <Text style={[styles.textLeft, styles.textBold]}>รานงานสถิติการใช้งาน</Text>
        <Image
          src={imageBarUrl} // ใส่ URL หรือ path ของภาพ
          style={{
            width: '100%',
            height: 200,
            objectFit: 'contain', // ควบคุมการแสดงผลของภาพ (สามารถปรับให้เหมาะสม)
            marginTop: 20,
            marginBottom: 100,
          }}
        />
        <Text style={[styles.textLeft, styles.textBold]}>ภาพรวมโครงการ</Text>
        <Text style={[styles.textCenter, styles.textBold]}>
          ภาพรวม{overview.province}
        </Text>
        <Image
          src={imageDonutUrl} // ใส่ URL หรือ path ของภาพ
          style={{
            width: '100%',
            height: 140,
            objectFit: 'contain', // ควบคุมการแสดงผลของภาพ (สามารถปรับให้เหมาะสม)
            marginTop: 20,
            marginBottom: 50,
          }}
        />
        <View
          style={[
            {
              width: '30%',
              borderRight: 0,
              padding: 0,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 30,
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* สร้างวงกลม (dot) */}
            {/* <Circle cx={20} cy={20} r={5} fill="#4f46e5 " /> */}
            <Canvas
              paint={(graphics) => {
                graphics.circle(20, 20, 5).fill('#4f46e5');
                return null; // Add this line to return null
              }}
            />
            {/* สร้างข้อความที่อยู่ข้างๆ dot */}
            <Text
              style={{ fontWeight: 'bold', paddingTop: 15, marginLeft: 10, fontSize: 12 }}
            >
              คะแนนที่สูงสุดจากทุกเขตพื้นที่ {overview.highestAreaScore}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* สร้างวงกลม (dot) */}
            <Canvas
              paint={(graphics) => {
                graphics.circle(20, 20, 5).fill('#e5e7eb');
                return null; // Add this line to return null
              }}
            />
            {/* <Canvas cx={20} cy={20} r={5} fill="#e5e7eb" />  paint={{ fill: "#e5e7eb" }} */}
            {/* สร้างข้อความที่อยู่ข้างๆ dot */}
            <Text
              style={{ fontWeight: 'bold', paddingTop: 15, marginLeft: 10, fontSize: 12 }}
            >
              คะแนนที่สูงสุดจากทุกเขตพื้นที่ {overview.averageAreaScore}
            </Text>
          </View>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        >
          <View
            style={{
              width: '30%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={[{ fontWeight: 'bold', fontSize: 12 }]}>คะแนนที่ต่ำที่สุด</Text>
            <Text style={[{ fontSize: 12, fontWeight: 300 }]}>
              {overview.lowestScore} คะแนน
            </Text>
          </View>
          <View
            style={{
              width: '40%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={[{ fontWeight: 'bold', fontSize: 12 }]}>คะแนนเฉลี่ย</Text>
            <Text style={[{ fontSize: 12, fontWeight: 300 }]}>
              {overview.averageScore} คะแนน
            </Text>
          </View>
          <View
            style={{
              width: '30%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={[{ fontWeight: 'bold', fontSize: 12 }]}>คะแนนที่สูงที่สุด</Text>
            <Text style={[{ fontSize: 12, fontWeight: 300 }]}>
              {overview.highestScore} คะแนน
            </Text>
          </View>
        </View>
      </Page>
      {data.length > 0 ? (
        <Page size="A4" style={tableStyles.page} wrap>
          {data.map((item, index) => (
            <RenderAccording
              item={item}
              level={1}
              key={'level1' + index}
              indexId={String(index)}
            />
            // <RenderAccording item={item} level={1} key={"level1" + item.SchoolId + item.Name} />
          ))}
        </Page>
      ) : null}
    </Document>
  );
};

export default DocumentPDF;
