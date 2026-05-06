export type TAdditionalFieldNutrition = {
  date: string;
};

/**
 * - `nutrition` is a 2D array ([][]) to represent data in the structure of ภาคเรียน (terms) and ครั้งที่ (instances).
 * - The first dimension of the array (outer array) represents each "ภาคเรียน" (e.g., ภาคเรียนที่ 1, ภาคเรียนที่ 2).
 * - The second dimension (inner array) represents multiple "ครั้งที่" (occurrences/entries) within that ภาคเรียน.
 *
 * For example:
 * [
 *   [ { date: '2024-06-01' }, { date: '2024-06-15' } ], // ภาคเรียนที่ 1: ครั้งที่ 1 และ 2
 *   [ { date: '2024-11-01' } ]                         // ภาคเรียนที่ 2: ครั้งที่ 1
 * ]
 *
 * This structure helps clearly separate nutrition checks or events across terms and their sub-instances.
 */
export type TGeneralTemplateAdditionalData = {
  hours?: number;
  end_date?: string;
  start_date?: string;
  nutrition?: TAdditionalFieldNutrition[][];
};
