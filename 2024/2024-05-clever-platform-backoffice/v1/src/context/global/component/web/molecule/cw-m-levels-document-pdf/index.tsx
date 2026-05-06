import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { LevelItem, Question } from '@domain/g02/g02-d05/local/type';
import FormQuestion from './form-question';
import { getQuestionType } from '@global/utils/levelConvert';

Font.register({
  family: 'THSarabun',
  fonts: [
    {
      src: '/font/THSarabun/SarabunRegular.ttf',
      fontWeight: 400,
    },
    {
      src: '/font/THSarabun/SarabunBold.ttf',
      fontWeight: 700,
    },
  ],
});

export const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    padding: 24,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: 'THSarabun',
  },
  title: {
    fontSize: 18,
  },
  textBold: {
    fontWeight: 700,
  },
  center: {
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  left: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    textAlign: 'center',
  },
  input: {
    height: 20,
    marginBottom: 4,
    borderBottom: '1px dashed black',
    textAlign: 'center',
  },
  signLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: '20%',
  },
  signRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: '20%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    padding: 2,
  },
  gridContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    width: '100%',
  },
  gridColumn: {
    flex: 1,
    textWrap: 'pretty',
  },
  gridColumn2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridItem: {
    width: '48%',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    width: '100%',
  },
});

type Props = {
  level?: LevelItem;
  standard?: LevelItem['standard'] | null;
  questionsList?: Question[];
};

const LevelDocumentPDF = ({ level, standard, questionsList }: Props) => {
  return (
    <Document>
      <Page size="A4" style={[styles.page, { position: 'relative' }]} wrap>
        <Text style={[styles.center, styles.textBold, { marginTop: 8 }]}>
          ข้อมูลด่านที่ {level?.id}
        </Text>
        <View>
          <Text style={styles.textBold}>สาระการเรียนรู้</Text>
          <Text>{standard?.criteria_name}</Text>
          <Text style={styles.textBold}>มาตรฐานหลัก</Text>
          <Text>{standard?.learning_content_name}</Text>
          <Text style={styles.textBold}>ตัวชี้วัด</Text>
          <Text>{standard?.indicator_name}</Text>
          <Text style={styles.textBold}>รูปแบบคำถาม</Text>
          <Text>{getQuestionType(level?.question_type)}</Text>
        </View>
        {questionsList?.map((question, index) => (
          <View key={index} style={[styles.gridContainer, { marginTop: 4 }]} wrap={false}>
            <View style={[styles.divider, { marginBottom: 4 }]} />
            <Text style={styles.textBold}>ข้อที่ {question.index}</Text>
            <FormQuestion
              mainLanguage={level?.language?.language || 'th'}
              question={question}
            />
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default LevelDocumentPDF;
