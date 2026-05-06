import testlogoMonster from './assets/test.png';
import testMap from './assets/testmap.jpg';

export interface Monster {
  id: number;
  MonsterName: string;
  image: string;
  tier: string;
}

export const MonsterData: Monster[] = [
  { id: 1, MonsterName: 'มอนเตอร์จ้า', image: testlogoMonster, tier: 'normal' },
  { id: 2, MonsterName: 'ราชินีดอกไม้', image: testlogoMonster, tier: 'pre-test' },
  { id: 3, MonsterName: 'ราชินีมด', image: testlogoMonster, tier: 'post-test' },
  { id: 4, MonsterName: 'ราชินีผึ้ง', image: testlogoMonster, tier: 'normal' },
  {
    id: 5,
    MonsterName: 'ราชินีเห็ด',
    image: testlogoMonster,
    tier: 'botestlogoMonsterss',
  },
  { id: 6, MonsterName: 'ราชินีกระรอก', image: testlogoMonster, tier: 'boss' },
  { id: 6, MonsterName: 'ราชินีกระรอก', image: testlogoMonster, tier: 'boss' },
  { id: 6, MonsterName: 'ราชินีกระรอก', image: testlogoMonster, tier: 'boss' },
  { id: 6, MonsterName: 'ราชินีกระรอก', image: testlogoMonster, tier: 'boss' },
];

export interface Map {
  id: number;
  MapName: string;
  image: string;
}

export const MapData: Map[] = [
  { id: 1, MapName: 'ทุ่งหญ้าทางตอนเหนือ 1', image: testMap },
  { id: 2, MapName: 'ทุ่งหญ้าทางตอนเหนือ 2', image: testMap },
  { id: 3, MapName: 'ทุ่งหญ้าทางตอนเหนือ 3', image: testMap },
  { id: 4, MapName: 'ทุ่งหญ้าทางตอนเหนือ 4', image: testMap },
  { id: 5, MapName: 'ทุ่งหญ้าทางตอนเหนือ 5', image: testMap },
  { id: 6, MapName: 'ทุ่งหญ้าทางตอนเหนือ 6', image: testMap },
  { id: 7, MapName: 'ทุ่งหญ้าทางตอนเหนือ 7', image: testMap },
  { id: 8, MapName: 'ทุ่งหญ้าทางตอนเหนือ 8', image: testMap },
  { id: 9, MapName: 'ทุ่งหญ้าทางตอนเหนือ 9', image: testMap },
];

export interface Level {
  levelId: string;
  levelName: string;
  tier: string;
}

export interface Sublesson {
  sublessonsId: string;
  sublessonsName: string;
  typeQuestion: string;
  level: Level[];
}

export interface Lesson {
  lessonsId: string;
  lessonsName: string;
  checkpoint: string;
  sublessons: Sublesson[];
}

export interface Data {
  subjectId: string;
  lessonCode: string;
  course: string;
  subjectName: string;
  year: string;
  usedStatus: string;
  lastUpdated: Date;
  lastUpdatedBy: string;
  lessons: Lesson[];
}

export const DataTest: Data[] = [
  {
    subjectId: '1',
    lessonCode: '00000001',
    course: 'มภร. สวนสุนันทา',
    subjectName: 'คณิตศาสตร์',
    year: 'ป.4',
    usedStatus: 'ใช้งาน',
    lastUpdated: new Date(),
    lastUpdatedBy: 'Admin',
    lessons: [
      {
        lessonsId: '1',
        lessonsName: 'บทเรียน 1 จำนวนนับ',
        checkpoint: '1',
        sublessons: [
          {
            sublessonsId: '1',
            sublessonsName: 'บทเรียนย่อย 1-1 จำนวนนับ',
            typeQuestion: 'แบบฝึกหัด',
            level: [
              {
                levelId: '00001',
                levelName: 'ด่านนี้นะ',
                tier: 'ง่าย',
              },
              {
                levelId: '00002',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ปานกลาง',
              },
              {
                levelId: '00003',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ยาก',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    subjectId: '2',
    lessonCode: '00000002',
    course: 'มภร. สวนสุนันทา',
    subjectName: 'คณิตศาสตร์',
    year: 'ป.4',
    usedStatus: 'ไม่ใช้งาน',
    lastUpdated: new Date(),
    lastUpdatedBy: 'Admin',
    lessons: [
      {
        lessonsId: '1',
        lessonsName: 'บทเรียน 1 จำนวนนับ',
        checkpoint: '1',
        sublessons: [
          {
            sublessonsId: '1',
            sublessonsName: 'บทเรียนย่อย 1-1 จำนวนนับ',
            typeQuestion: 'แบบฝึกหัด',
            level: [
              {
                levelId: '00001',
                levelName: 'ด่านนี้นะ',
                tier: 'ง่าย',
              },
              {
                levelId: '00002',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ปานกลาง',
              },
              {
                levelId: '00003',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ยาก',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    subjectId: '3',
    lessonCode: '00000001',
    course: 'มภร. สวนสุนันทา',
    subjectName: 'คณิตศาสตร์',
    year: 'ป.4',
    usedStatus: 'แบบร่าง',
    lastUpdated: new Date(),
    lastUpdatedBy: 'Admin',
    lessons: [
      {
        lessonsId: '1',
        lessonsName: 'บทเรียน 1 จำนวนนับ',
        checkpoint: '1',
        sublessons: [
          {
            sublessonsId: '1',
            sublessonsName: 'บทเรียนย่อย 1-1 จำนวนนับ',
            typeQuestion: 'แบบฝึกหัด',
            level: [
              {
                levelId: '00001',
                levelName: 'ด่านนี้นะ',
                tier: 'ง่าย',
              },
              {
                levelId: '00002',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ปานกลาง',
              },
              {
                levelId: '00003',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ยาก',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    subjectId: '4',
    lessonCode: '00000001',
    course: 'มภร. สวนสุนันทา',
    subjectName: 'คณิตศาสตร์',
    year: 'ป.4',
    usedStatus: 'แบบร่าง',
    lastUpdated: new Date(),
    lastUpdatedBy: 'Admin',
    lessons: [
      {
        lessonsId: '1',
        lessonsName: 'บทเรียน 1 จำนวนนับ',
        checkpoint: '1',
        sublessons: [
          {
            sublessonsId: '1',
            sublessonsName: 'บทเรียนย่อย 1-1 จำนวนนับ',
            typeQuestion: 'แบบฝึกหัด',
            level: [
              {
                levelId: '00001',
                levelName: 'ด่านนี้นะ',
                tier: 'ง่าย',
              },
              {
                levelId: '00002',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ปานกลาง',
              },
              {
                levelId: '00003',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ยาก',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    subjectId: '5',
    lessonCode: '00000001',
    course: 'มภร. สวนสุนันทา',
    subjectName: 'คณิตศาสตร์',
    year: 'ป.4',
    usedStatus: 'แบบร่าง',
    lastUpdated: new Date(),
    lastUpdatedBy: 'Admin',
    lessons: [
      {
        lessonsId: '2',
        lessonsName: 'บทเรียน 1 จำนวนนับ',
        checkpoint: '1',
        sublessons: [
          {
            sublessonsId: '1',
            sublessonsName: 'บทเรียนย่อย 1-1 จำนวนนับ',
            typeQuestion: 'แบบฝึกหัด',
            level: [
              {
                levelId: '00001',
                levelName: 'ด่านนี้นะ',
                tier: 'ง่าย',
              },
              {
                levelId: '00002',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ปานกลาง',
              },
              {
                levelId: '00003',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ยาก',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    subjectId: '6',
    lessonCode: '00000001',
    course: 'มภร. สวนสุนันทา',
    subjectName: 'คณิตศาสตร์',
    year: 'ป.4',
    usedStatus: 'แบบร่าง',
    lastUpdated: new Date(),
    lastUpdatedBy: 'Admin',
    lessons: [
      {
        lessonsId: '1',
        lessonsName: 'บทเรียน 1 จำนวนนับ',
        checkpoint: '1',
        sublessons: [
          {
            sublessonsId: '1',
            sublessonsName: 'บทเรียนย่อย 1-1 จำนวนนับ',
            typeQuestion: 'แบบฝึกหัด',
            level: [
              {
                levelId: '00001',
                levelName: 'ด่านนี้นะ',
                tier: 'ง่าย',
              },
              {
                levelId: '00002',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ปานกลาง',
              },
              {
                levelId: '00003',
                levelName: 'ด่านนี้นะจ้ะ',
                tier: 'ยาก',
              },
            ],
          },
        ],
      },
    ],
  },
];
