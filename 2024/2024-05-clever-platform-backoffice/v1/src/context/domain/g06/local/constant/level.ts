export const LevelTypeMapTH = {
  'pre-post-test': 'ด่านทดสอบก่อนเรียน',
  'test-easy': 'ด่านง่าย',
  'test-medium': 'ด่านปานกลาง',
  'test-hard': 'ด่านยาก',
  'easy-medium-hard-test': 'ด่านรวม ง่าย ปานกลาง และยาก',
  'sub-lesson-post-test': 'ด่านทดสอบบทเรียนย่อยก่อนเรียน',
};

export const LevelTypeMapEN = Object.fromEntries(
  Object.entries(LevelTypeMapTH).map(([key, value]) => [value, key]),
);

export type LevelType = keyof typeof LevelTypeMapTH;
export type LevelTypeValueTH = (typeof LevelTypeMapTH)[keyof typeof LevelTypeMapTH];
