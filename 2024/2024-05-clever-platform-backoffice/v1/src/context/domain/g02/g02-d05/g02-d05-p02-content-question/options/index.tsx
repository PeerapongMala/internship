const answerPosition = [
  {
    id: '1',
    imgSrc: '/assets/images/create-quiz/game-layout-horizontal.png',
    title: '',
  },
  {
    id: '2',
    imgSrc: '/assets/images/create-quiz/game-layout-vertical.png',
    title: '',
  },
];

const layoutPosition = [
  {
    id: '1:1',
    imgSrc: '/assets/images/create-quiz/layout-5-5.png',
    title: '1 : 1 (ค่าเริ่มต้น)',
  },
  {
    id: '3:7',
    imgSrc: '/assets/images/create-quiz/layout-3-7.png',
    title: '3 : 7',
  },
  {
    id: '7:3',
    imgSrc: '/assets/images/create-quiz/layout-7-3.png',
    title: '7 : 3',
  },
];

const optionsColumn = [
  { value: '1-col', label: '1 คอลัมน์' },
  { value: '2-col', label: '2 คอลัมน์' },
  { value: '3-col', label: '3 คอลัมน์' },
  { value: '4-col', label: '4 คอลัมน์' },
  { value: '1-row', label: '1 แถว' },
  { value: '2-row', label: '2 แถว' },
  { value: '3-row', label: '3 แถว' },
  { value: '4-row', label: '4 แถว' },
];

const optionsAnswerSelect = [
  { value: 'text-speech', label: 'ข้อความ' },
  { value: 'image', label: 'รูปภาพ' },
  { value: 'speech', label: 'เสียง' },
];

const optionsAnswerSelectCount = [
  { value: '1', label: '1 ตัวเลือก' },
  { value: '2', label: '2 ตัวเลือก' },
  { value: '3', label: '3 ตัวเลือก' },
  { value: '4', label: '4 ตัวเลือก' },
  { value: '5', label: '5 ตัวเลือก' },
  { value: '6', label: '6 ตัวเลือก' },
  { value: '7', label: '7 ตัวเลือก' },
  { value: '8', label: '8 ตัวเลือก' },
  { value: '9', label: '9 ตัวเลือก' },
  { value: '10', label: '10 ตัวเลือก' },
];

const optionsAnswerSelectFakeCount = [
  { value: '1', label: '1 ตัวเลือก' },
  { value: '2', label: '2 ตัวเลือก' },
  { value: '3', label: '3 ตัวเลือก' },
  { value: '4', label: '4 ตัวเลือก' },
  { value: '5', label: '5 ตัวเลือก' },
  { value: '6', label: '6 ตัวเลือก' },
  { value: '7', label: '7 ตัวเลือก' },
  { value: '8', label: '8 ตัวเลือก' },
];

const optionGroupCount = [
  { value: '1', label: '1 กลุ่ม' },
  { value: '2', label: '2 กลุ่ม' },
  { value: '3', label: '3 กลุ่ม' },
  { value: '4', label: '4 กลุ่ม' },
  { value: '5', label: '5 กลุ่ม' },
  { value: '6', label: '6 กลุ่ม' },
  { value: '7', label: '7 กลุ่ม' },
];

const optionAnswerCount = [
  { value: 'one', label: 'คำตอบถูกได้ 1 ข้อ' },
  { value: 'more', label: 'คำตอบถูกได้มากกว่า 1 ข้อ' },
];

export {
  answerPosition,
  layoutPosition,
  optionsColumn,
  optionsAnswerSelect,
  optionsAnswerSelectCount,
  optionsAnswerSelectFakeCount,
  optionGroupCount,
  optionAnswerCount,
};
