import IconSettings from '../../../components/Icon/IconSettings';
import IconPencil from '../../../components/Icon/IconPencil';
import IconLinkedin from '../../../components/Icon/IconLinkedin';
import IconEye from '../../../components/Icon/IconEye';
import IconPlayCircle from '../../../components/Icon/IconPlayCircle';
import IconType from '@/components/Icon/IconType';
import IconGraphicEq from '@/components/Icon/IconGraphicEq';

const tabs = [
    {
        id: 1,
        label: '1. ตั้งค่าด่าน',
        icon: <IconSettings duotone={false} />,
        path: '/content-creator/create-setting',
    },
    {
        id: 2,
        label: '2. จัดการคำถาม',
        icon: <IconPencil duotone={false} />,
        path: '/content-creator/create-question',
    },
    {
        id: 3,
        label: '3. แปลภาษา',
        icon: <IconType className='w-5 h-5' />,
        path: '/content-creator/create-translate',
    },
    {
        id: 4,
        label: '4. สร้างเสียง',
        icon: <IconGraphicEq duotone={false} />,
        path: '/content-creator/create-sound',
    },
    {
        id: 5,
        label: '5. เผยแพร่',
        icon: <IconEye duotone={false} />,
        path: '/content-creator/create-public',
    }
];

const optionAffiliation = [
    { value: '1', label: 'มรก. สวนสุนันทา' },
    { value: '2', label: 'สังกัด 2' },
    { value: '3', label: 'สังกัด 3' },
]

const optionYear = [
    { value: '1', label: 'ป. 1' },
    { value: '2', label: 'ป. 2' },
    { value: '3', label: 'ป. 3' },
    { value: '4', label: 'ป. 4' },
    { value: '5', label: 'ป. 5' },
]
const optionGroup = [
    { value: '1', label: 'คณิตศาสตร์' },
    { value: '2', label: 'กลุ่ม 2' },
    { value: '3', label: 'กลุ่ม 3' },
]
const optionSubject = [
    { value: '1', label: 'คณิตศาสตร์ 1' },
    { value: '2', label: 'วิทยาศาสตร์' },
    { value: '3', label: 'ภาษาไทย' },
]


const optionLesson = [
    { value: '1', label: 'บทเรียน 1' },
    { value: '2', label: 'บทเรียน 2' },
    { value: '3', label: 'บทเรียน 3' },
]

const optionSubLesson = [
    { value: '1', label: 'บทเรียนย่อย 1' },
    { value: '2', label: 'บทเรียนย่อย 2' },
    { value: '3', label: 'บทเรียนย่อย 3' },
]

const optionBloom = [
    { value: '1', label: 'ระดับ 1' },
    { value: '2', label: 'ระดับ 2' },
    { value: '3', label: 'ระดับ 3' },
]

const optionSubStandard1 = [
    { value: '1', label: 'มาตรฐานย่อย 1' },
    { value: '2', label: 'มาตรฐานย่อย 2' },
    { value: '3', label: 'มาตรฐานย่อย 3' },
]

const optionExerciseType = [
    { value: '1', label: 'แบบฝึกหัด 1' },
    { value: '2', label: 'แบบฝึกหัด 2' },
    { value: '3', label: 'แบบฝึกหัด 3' },
]

const optionDifficulty = [
    { value: '1', label: 'ง่าย' },
    { value: '2', label: 'ปานกลาง' },
    { value: '3', label: 'ยาก' },
]

const optionTimerBetweenPlay = [
    { value: '1', label: 'จับเวลา ไม่สามารถเล่นต่อได้ถ้าหมดเวลา' },
    { value: '2', label: 'ปิด' },
]

const optionTimerBetweenPlaySecond = [
    { value: '1', label: '30' },
    { value: '2', label: '60' },
    { value: '3', label: '90' },
]

export {
    tabs,
    optionAffiliation,
    optionYear,
    optionGroup,
    optionSubject,
    optionLesson,
    optionSubLesson,
    optionBloom,
    optionSubStandard1,
    optionExerciseType,
    optionDifficulty,
    optionTimerBetweenPlay,
    optionTimerBetweenPlaySecond,
};