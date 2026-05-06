import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconFileText1 from '@core/design-system/library/component/icon/IconFileText1';
import IconGroup from '@core/design-system/library/component/icon/IconGroup';
import IconImportContacts from '@core/design-system/library/component/icon/IconImportContacts';
import { Tab } from '../types';

export const evaluationTabs: Tab[] = [
  { id: 1, icon: <IconFileText1 />, label: 'ข้อมูลวิชา' },
  { id: 2, icon: <IconGroup />, label: 'เพิ่มผู้รับผิดชอบ' },
  { id: 3, icon: <IconImportContacts />, label: 'เพิ่มสาระการเรียนรู้' },
  { id: 4, icon: <IconEye />, label: 'เผยแพร่' },
];
