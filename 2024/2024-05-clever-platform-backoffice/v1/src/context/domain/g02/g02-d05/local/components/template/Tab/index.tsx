import IconSettings from '@core/design-system/library/vristo/source/components/Icon/IconSettings';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import IconLinkedin from '@core/design-system/library/vristo/source/components/Icon/IconLinkedin';
import IconEye from '@core/design-system/library/vristo/source/components/Icon/IconEye';
import IconPlayCircle from '@core/design-system/library/vristo/source/components/Icon/IconPlayCircle';
import IconType from '@core/design-system/library/vristo/source/components/Icon/IconType';
import IconGraphicEq from '@core/design-system/library/component/icon/IconGraphicEq';

const tabs = [
  {
    id: 1,
    label: '1. ตั้งค่าด่าน',
    icon: <IconSettings duotone={false} />,
    path: '/content-creator/level/SUBLESSONID/create-setting',
  },
  {
    id: 2,
    label: '2. จัดการคำถาม',
    icon: <IconPencil duotone={false} />,
    path: '/content-creator/level/SUBLESSONID/create-question',
  },
  {
    id: 3,
    label: '3. แปลภาษา',
    icon: <IconType className="h-5 w-5" />,
    path: '/content-creator/level/SUBLESSONID/create-translate',
  },
  {
    id: 4,
    label: '4. สร้างเสียง',
    icon: <IconGraphicEq className="h-7 w-7" />,
    path: '/content-creator/level/SUBLESSONID/create-sound',
  },
  {
    id: 5,
    label: '5. เผยแพร่',
    icon: <IconEye duotone={false} />,
    path: '/content-creator/level/SUBLESSONID/create-public',
  },
];

export default tabs;
export { tabs };
