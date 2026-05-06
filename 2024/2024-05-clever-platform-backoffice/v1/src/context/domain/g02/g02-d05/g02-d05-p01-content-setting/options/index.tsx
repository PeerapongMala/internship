const optionAffiliation = [
  { value: '1', label: 'มรก. สวนสุนันทา' },
  { value: '2', label: 'สังกัด 2' },
  { value: '3', label: 'สังกัด 3' },
];

const optionYear = [
  { value: '1', label: 'ป. 1' },
  { value: '2', label: 'ป. 2' },
  { value: '3', label: 'ป. 3' },
  { value: '4', label: 'ป. 4' },
  { value: '5', label: 'ป. 5' },
];
const optionGroup = [
  { value: '1', label: 'คณิตศาสตร์' },
  { value: '2', label: 'กลุ่ม 2' },
  { value: '3', label: 'กลุ่ม 3' },
];
const optionSubject = [
  { value: '1', label: 'คณิตศาสตร์ 1' },
  { value: '2', label: 'วิทยาศาสตร์' },
  { value: '3', label: 'ภาษาไทย' },
];

const optionLesson = [
  { value: '1', label: 'บทเรียน 1' },
  { value: '2', label: 'บทเรียน 2' },
  { value: '3', label: 'บทเรียน 3' },
];

const optionSubLesson = [
  { value: '1', label: 'บทเรียนย่อย 1' },
  { value: '2', label: 'บทเรียนย่อย 2' },
  { value: '3', label: 'บทเรียนย่อย 3' },
];

const optionBloom = [
  { value: '1', label: 'ระดับ 1' },
  { value: '2', label: 'ระดับ 2' },
  { value: '3', label: 'ระดับ 3' },
  { value: '4', label: 'ระดับ 4' },
  { value: '5', label: 'ระดับ 5' },
  { value: '6', label: 'ระดับ 6' },
];

const optionSubStandard1 = [
  { value: '1', label: 'มาตรฐานย่อย 1' },
  { value: '2', label: 'มาตรฐานย่อย 2' },
  { value: '3', label: 'มาตรฐานย่อย 3' },
];

const optionLevelType = [
  { value: 'test', label: 'แบบฝึกหัดทั่วไป' },
  { value: 'sub-lesson-post-test', label: 'แบบฝึกหัดท้ายบทเรียนย่อย' }, // 15 คำถาม
  { value: 'pre-post-test', label: 'แบบฝึกหัดก่อนเรียน' }, // เอาหมด
];

const optionDifficulty = [
  { value: 'easy', label: 'ง่าย' },
  { value: 'medium', label: 'ปานกลาง' },
  { value: 'hard', label: 'ยาก' },
];

export {
  optionAffiliation,
  optionYear,
  optionGroup,
  optionSubject,
  optionLesson,
  optionSubLesson,
  optionBloom,
  optionSubStandard1,
  optionLevelType,
  optionDifficulty,
};
