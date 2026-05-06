import { Assessment, AssessmentDto, GeneralType, StudentDetailDto } from '../local/type';
import get from 'lodash/get';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { defaultTo } from 'lodash';

dayjs.extend(buddhistEra);
dayjs.locale('th');

export const transformToTable = (data: AssessmentDto) => {
  const assessment = convertAssessmentMeasure(data);
  const nutritional = convertNutritional(data);

  return {
    tableData: [...assessment, nutritional],
  };
};

function convertAssessmentMeasure(assessment: AssessmentDto): Array<any> {
  // Helper function to format dates
  const formatDate = (dateObj: any): string => {
    try {
      if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return '-';
      }

      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      return dayjs(dateObj).format('DD MMMM BBBB');
    } catch (error) {
      return '-';
    }
  };

  // Initialize the formatted array
  const formattedArray = [
    {
      title: 'น้ำหนัก - ส่วนสูง',
      rows: [
        {
          label: 'วันที่ชั่งน้ำหนัก/วัดส่วนสูง',
          term1Round1: formatDate(
            get(assessment, 'measurement.semester1.round1.measurementDate'),
          ),
          term1Round2: formatDate(
            get(assessment, 'measurement.semester1.round2.measurementDate'),
          ),
          term2Round1: formatDate(
            get(assessment, 'measurement.semester2.round1.measurementDate'),
          ),
          term2Round2: formatDate(
            get(assessment, 'measurement.semester2.round2.measurementDate'),
          ),
        },
        {
          label: 'น้ำหนัก (กิโลกรัม)',
          term1Round1: get(assessment, 'measurement.semester1.round1.weight', '-'),
          term1Round2: get(assessment, 'measurement.semester1.round2.weight', '-'),
          term2Round1: get(assessment, 'measurement.semester2.round1.weight', '-'),
          term2Round2: get(assessment, 'measurement.semester2.round2.weight', '-'),
        },
        {
          label: 'ส่วนสูง (เซนติเมตร)',
          term1Round1: get(assessment, 'measurement.semester1.round1.height', '-'),
          term1Round2: get(assessment, 'measurement.semester1.round2.height', '-'),
          term2Round1: get(assessment, 'measurement.semester2.round1.height', '-'),
          term2Round2: get(assessment, 'measurement.semester2.round2.height', '-'),
        },
      ],
    },
  ];

  return formattedArray;
}

function convertNutritional(assessment: AssessmentDto): any {
  // Initialize the formatted object
  const formattedObject = {
    title: 'ผลการประเมินภาวะโภชนาการ\nตามเกณฑ์อายุ',
    rows: [
      {
        label: 'น้ำหนักตามเกณฑ์อายุ',
        term1Round1: assessment?.nutritional?.semester1?.round1?.weightAge || '-',
        term1Round2: assessment?.nutritional?.semester1?.round2?.weightAge || '-',
        term2Round1: assessment?.nutritional?.semester2?.round1?.weightAge || '-',
        term2Round2: assessment?.nutritional?.semester2?.round2?.weightAge || '-',
      },
      {
        label: 'ส่วนสูงตามเกณฑ์อายุ',
        term1Round1: assessment?.nutritional?.semester1?.round1?.heightAge || '-',
        term1Round2: assessment?.nutritional?.semester1?.round2?.heightAge || '-',
        term2Round1: assessment?.nutritional?.semester2?.round1?.heightAge || '-',
        term2Round2: assessment?.nutritional?.semester2?.round2?.heightAge || '-',
      },
      {
        label: 'น้ำหนักตามเกณฑ์ส่วนสูง',
        term1Round1: assessment?.nutritional?.semester1?.round1?.weightHeight || '-',
        term1Round2: assessment?.nutritional?.semester1?.round2?.weightHeight || '-',
        term2Round1: assessment?.nutritional?.semester2?.round1?.weightHeight || '-',
        term2Round2: assessment?.nutritional?.semester2?.round2?.weightHeight || '-',
      },
    ],
  };

  return formattedObject;
}

export function getWeightHeightMeasurement(
  generals: StudentDetailDto['dataJson']['general'] | null,
) {
  const general = generals?.find((i) => i.generalType === GeneralType.nutrition);

  return general?.nutrition.reduce((acc, current, i) => {
    const count = i + 1;
    const chuckSize = 10;
    const startIndex = i * chuckSize;

    if (startIndex >= general.studentIndicatorData.length) {
      console.warn(`No studentIndicatorData chunk found for semester ${count}`);
      return acc;
    }

    const currentChunk = general.studentIndicatorData.slice(
      startIndex,
      chuckSize * count,
    );

    const rounded1_weight_kg = currentChunk[0];
    const rounded1_weight_cm = currentChunk[1];

    const rounded2_weight_kg_option1 = currentChunk[5];
    const rounded2_weight_cm_option1 = currentChunk[6];

    acc = {
      ...acc,
      [`semester_${count}`]: {
        round_1: {
          measurement_date: current[0]?.date,
          weight_kg: rounded1_weight_kg.value,
          height_cm: rounded1_weight_cm.value,
        },
        round_2: {
          measurement_date: current[1]?.date,
          weight_kg: rounded2_weight_kg_option1.value,
          height_cm: rounded2_weight_cm_option1.value,
        },
      },
    };
    return acc;
  }, {});
}

export function getAssessmentMeasurement(
  generals: StudentDetailDto['dataJson']['general'] | null,
) {
  const general = generals?.find((i) => i.generalType === GeneralType.nutrition);

  return general?.nutrition.reduce((acc, current, i) => {
    const count = i + 1;
    const chuckSize = 10;
    const startIndex = i * chuckSize;

    if (startIndex >= general.studentIndicatorData.length) {
      console.warn(`No studentIndicatorData chunk found for semester ${count}`);
      return acc;
    }

    const currentChunk = general.studentIndicatorData.slice(
      startIndex,
      chuckSize * count,
    );

    const weight_for_age = currentChunk[2];
    const height_for_age = currentChunk[3];
    const weight_for_height = currentChunk[4];

    const weight_for_age_optional1 = currentChunk[7];
    const height_for_age_optional1 = currentChunk[8];
    const height_for_height_optional1 = currentChunk[9];

    acc = {
      ...acc,
      [`semester_${count}`]: {
        round_1: {
          measurement_date: current[0]?.date,
          weight_for_age: weight_for_age.value,
          height_for_age: height_for_age.value,
          weight_for_height: weight_for_height.value,
        },
        round_2: {
          weight_for_age: weight_for_age_optional1.value,
          height_for_age: height_for_age_optional1.value,
          weight_for_height: height_for_height_optional1.value,
        },
      },
    };
    return acc;
  }, {});
}

export function transformToStudentAssessmentDTO(
  partialDto: Partial<Assessment>,
): AssessmentDto {
  const defaultDto: AssessmentDto = {
    measurement: {
      semester1: {
        round1: { measurementDate: new Date(), weight: '-', height: '-' },
        round2: { measurementDate: new Date(), weight: '-', height: '-' },
      },
      semester2: {
        round1: { measurementDate: new Date(), weight: '-', height: '-' },
        round2: { measurementDate: new Date(), weight: '-', height: '-' },
      },
    },
    nutritional: {
      semester1: {
        round1: { weightAge: '-', heightAge: '-', weightHeight: '-' },
        round2: { weightAge: '-', heightAge: '-', weightHeight: '-' },
      },
      semester2: {
        round1: { weightAge: '-', heightAge: '-', weightHeight: '-' },
        round2: { weightAge: '-', heightAge: '-', weightHeight: '-' },
      },
    },
  };
  if (!partialDto) {
    return defaultDto;
  }

  const result = { ...defaultDto };

  // Transform weight and height measurements
  if (partialDto.weight_height_measurement) {
    const measurements = partialDto.weight_height_measurement;

    // Transform semester 1
    if (measurements.semester_1) {
      // Round 1
      result.measurement.semester1.round1 = {
        measurementDate: new Date(
          defaultTo(get(measurements, 'semester_1.round_1.measurement_date'), new Date()),
        ),
        weight: measurements?.semester_1?.round_1?.weight_kg || '-',
        height: measurements?.semester_1?.round_1?.height_cm || '-',
      };

      // Round 2
      result.measurement.semester1.round2 = {
        measurementDate: new Date(
          defaultTo(get(measurements, 'semester_1.round_2.measurement_date'), new Date()),
        ),
        weight: measurements?.semester_1?.round_2?.weight_kg || '-',
        height: measurements?.semester_1?.round_2?.height_cm || '-',
      };
    }

    // Transform semester 2
    if (measurements.semester_2) {
      // Round 1
      result.measurement.semester2.round1 = {
        measurementDate: new Date(
          defaultTo(get(measurements, 'semester_2.round_1.measurement_date'), new Date()),
        ),
        weight: measurements?.semester_2?.round_1?.weight_kg || '-',
        height: measurements?.semester_2?.round_1?.height_cm || '-',
      };

      // Round 2
      result.measurement.semester2.round2 = {
        measurementDate: new Date(
          defaultTo(get(measurements, 'semester_2.round_2.measurement_date'), new Date()),
        ),
        weight: measurements?.semester_2?.round_2?.weight_kg || '-',
        height: measurements?.semester_2?.round_2?.height_cm || '-',
      };
    }
  }

  // Transform nutritional assessments
  if (partialDto.nutritional_assessment_by_age) {
    const nutritional = partialDto.nutritional_assessment_by_age;

    // Transform semester 1
    if (nutritional.semester_1) {
      // Round 1
      result.nutritional.semester1.round1 = {
        weightAge: nutritional?.semester_1?.round_1?.weight_for_age || '-',
        heightAge: nutritional?.semester_1?.round_1?.height_for_age || '-',
        weightHeight: nutritional?.semester_1?.round_1?.weight_for_height || '-',
      };

      // Round 2
      result.nutritional.semester1.round2 = {
        weightAge: nutritional?.semester_1?.round_2?.weight_for_age || '-',
        heightAge: nutritional?.semester_1?.round_2?.height_for_age || '-',
        weightHeight: nutritional?.semester_1?.round_2?.weight_for_height || '-',
      };
    }

    // Transform semester 2
    if (nutritional.semester_2) {
      // Round 1
      result.nutritional.semester2.round1 = {
        weightAge: nutritional?.semester_2?.round_1?.weight_for_age || '-',
        heightAge: nutritional?.semester_2?.round_1?.height_for_age || '-',
        weightHeight: nutritional?.semester_2?.round_1?.weight_for_height || '-',
      };

      // Round 2
      result.nutritional.semester2.round2 = {
        weightAge: nutritional?.semester_2?.round_2?.weight_for_age || '-',
        heightAge: nutritional?.semester_2?.round_2?.height_for_age || '-',
        weightHeight: nutritional?.semester_2?.round_2?.weight_for_height || '-',
      };
    }
  }

  return result;
}

export function transformAttendanceData(inputData: any[]) {
  return inputData.map((item) => {
    return {
      month: item.month,
      scheduled: item.totalDays || '-',
      attended: item.attendedDays || '-',
      percentage: item.percentage || '-',
      notes: item.notes === '-' ? '' : item.notes,
    };
  });
}

export function transformHealthData(inputData: any[]) {
  const formatHealthValue = (value: string | number): string => {
    if (
      value === 0 ||
      value === '0' ||
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '-';
    }
    return value.toString();
  };

  const weightHeightSection = inputData.find((section) =>
    section.title.includes('น้ำหนัก - ส่วนสูง'),
  );

  const nutritionSection = inputData.find((section) =>
    section.title.includes('ผลการประเมินภาวะโภชนาการ'),
  );

  const dateRow = weightHeightSection?.rows.find((row: any) =>
    row.label.includes('วันที่ชั่งน้ำหนัก'),
  );

  const weightRow = weightHeightSection?.rows.find((row: any) =>
    row.label.includes('น้ำหนัก (กิโลกรัม)'),
  );

  const heightRow = weightHeightSection?.rows.find((row: any) =>
    row.label.includes('ส่วนสูง (เซนติเมตร)'),
  );

  const weightByAgeRow = nutritionSection?.rows.find((row: any) =>
    row.label.includes('น้ำหนักตามเกณฑ์อายุ'),
  );

  const heightByAgeRow = nutritionSection?.rows.find((row: any) =>
    row.label.includes('ส่วนสูงตามเกณฑ์อายุ'),
  );

  const weightByHeightRow = nutritionSection?.rows.find((row: any) =>
    row.label.includes('น้ำหนักตามเกณฑ์ส่วนสูง'),
  );

  return {
    dates: {
      semester1: {
        period1: dateRow?.term1Round1?.toString() || '',
        period2: dateRow?.term1Round2?.toString() || '',
      },
      semester2: {
        period1: dateRow?.term2Round1?.toString() || '',
        period2: dateRow?.term2Round2?.toString() || '',
      },
    },
    measurements: {
      weight: {
        semester1: {
          period1: formatHealthValue(weightRow?.term1Round1 || 0),
          period2: formatHealthValue(weightRow?.term1Round2 || 0),
        },
        semester2: {
          period1: formatHealthValue(weightRow?.term2Round1 || 0),
          period2: formatHealthValue(weightRow?.term2Round2 || 0),
        },
      },
      height: {
        semester1: {
          period1: formatHealthValue(heightRow?.term1Round1 || 0),
          period2: formatHealthValue(heightRow?.term1Round2 || 0),
        },
        semester2: {
          period1: formatHealthValue(heightRow?.term2Round1 || 0),
          period2: formatHealthValue(heightRow?.term2Round2 || 0),
        },
      },
      weightByAge: {
        semester1: {
          period1: formatHealthValue(weightByAgeRow?.term1Round1 || 0),
          period2: formatHealthValue(weightByAgeRow?.term1Round2 || 0),
        },
        semester2: {
          period1: formatHealthValue(weightByAgeRow?.term2Round1 || 0),
          period2: formatHealthValue(weightByAgeRow?.term2Round2 || 0),
        },
      },
      heightByAge: {
        semester1: {
          period1: formatHealthValue(heightByAgeRow?.term1Round1 || 0),
          period2: formatHealthValue(heightByAgeRow?.term1Round2 || 0),
        },
        semester2: {
          period1: formatHealthValue(heightByAgeRow?.term2Round1 || 0),
          period2: formatHealthValue(heightByAgeRow?.term2Round2 || 0),
        },
      },
      weightByHeight: {
        semester1: {
          period1: formatHealthValue(weightByHeightRow?.term1Round1 || 0),
          period2: formatHealthValue(weightByHeightRow?.term1Round2 || 0),
        },
        semester2: {
          period1: formatHealthValue(weightByHeightRow?.term2Round1 || 0),
          period2: formatHealthValue(weightByHeightRow?.term2Round2 || 0),
        },
      },
    },
  };
}
