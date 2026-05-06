import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import { SkillName } from '@/types/skillType';

export type CardInfo = {
  skillId: SkillName;
  // advanceSkillId?: SkillName;
  baseSkillId?: SkillName;
  bg: string;
  image: string;
  title: string;
  desc: string;
  level: number;
  label?: string;
};

const labelNew = 'ใหม่!';

export const AvailableCardInfo: Record<SkillName, CardInfo> = {
  [SkillName.DRONE]: {
    skillId: SkillName.DRONE,
    bg: PUBLIC_ASSETS_LOCATION.image.special.upgrade.weaponCardBG1,
    image: PUBLIC_ASSETS_LOCATION.image.special.weapon.drone,
    title: 'Drone',
    desc: 'อาวุธลอยไปมาในบริเวณใกล้เคียง\nคอยช่วยโจมตีศัตรูเป็นระยะ',
    level: 0,
    label: labelNew,
  },
  [SkillName.FIREBALL]: {
    skillId: SkillName.FIREBALL,
    bg: PUBLIC_ASSETS_LOCATION.image.special.upgrade.weaponCardBG1,
    image: PUBLIC_ASSETS_LOCATION.image.special.weapon.bullet,
    title: 'Bullet',
    desc: 'อาวุธพุ่งออกจากตัวละครหลัก\nไปยังศัตรูที่ใกล้ที่สุด',
    level: 1,
    label: labelNew,
  },
  [SkillName.ICEBALL]: {
    skillId: SkillName.ICEBALL,
    bg: PUBLIC_ASSETS_LOCATION.image.special.upgrade.weaponCardBG1,
    image: PUBLIC_ASSETS_LOCATION.image.special.weapon.rowel,
    title: 'Rowel',
    desc: 'อาวุธลอยเคลื่อนที่เป็นวงกลม\nโคจรรอบตัวละครหลักในแนวราบ',
    level: 0,
    label: labelNew,
  },
  [SkillName.LASER]: {
    skillId: SkillName.LASER,
    bg: PUBLIC_ASSETS_LOCATION.image.special.upgrade.weaponCardBG1,
    image: PUBLIC_ASSETS_LOCATION.image.special.weapon.laser,
    title: 'Laser',
    desc: 'อาวุธปรากฎขึ้นเป็นลำแสง\nฉายตรงไปยังศัตรูที่ใกล้ที่สุด',
    level: 0,
    label: labelNew,
  },
  [SkillName.MOLOTOV]: {
    skillId: SkillName.MOLOTOV,
    bg: PUBLIC_ASSETS_LOCATION.image.special.upgrade.weaponCardBG1,
    image: PUBLIC_ASSETS_LOCATION.image.special.weapon.molotov,
    title: 'Molotov',
    desc: 'อาวุธปรากฎขึ้นเป็นบริเวณพื้นที่ไฟใหม้\nใกล้กับตัวละครหลัก',
    level: 0,
    label: labelNew,
  },
  [SkillName.RPG]: {
    skillId: SkillName.RPG,
    bg: PUBLIC_ASSETS_LOCATION.image.special.upgrade.weaponCardBG1,
    image: PUBLIC_ASSETS_LOCATION.image.special.weapon.rocket,
    title: 'Rocket',
    desc: 'อาวุธพุ่งตรงไปยังจุดที่มีศัตรูที่ใกล้ที่สุด\nจากนั้นระเบิดเมื่อถึงเป้าหมาย',
    level: 0,
    label: labelNew,
  },
};

export const AvailableCardInfoArray = Object.entries(AvailableCardInfo);

// Capture initial levels to support resetting later without coupling to store
const InitialSkillLevels: Record<SkillName, number> = Object.entries(
  AvailableCardInfo,
).reduce(
  (acc, [key, value]) => {
    acc[key as SkillName] = value.level;
    return acc;
  },
  {} as Record<SkillName, number>,
);

// Helpers for accessing/updating skill levels directly on AvailableCardInfo
export function getAvailableCardLevel(skill: SkillName): number {
  return AvailableCardInfo[skill]?.level ?? 0;
}

export function setAvailableCardLevel(skill: SkillName, level: number): void {
  if (AvailableCardInfo[skill]) {
    AvailableCardInfo[skill].level = level;
  }
}

export function resetAvailableCardLevels(): void {
  (Object.keys(AvailableCardInfo) as SkillName[]).forEach((skill) => {
    AvailableCardInfo[skill].level = InitialSkillLevels[skill] ?? 0;
  });
}
