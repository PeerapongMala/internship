export enum EScoreEvaluationType {
  NO_CRITERIA = 'NO_CRITERIA',
  ACADEMIC_CRITERIA = 'ACADEMIC_CRITERIA',
  TEACHER_CRITERIA = 'TEACHER_CRITERIA',
}

export enum EGradeTemplateType {
  /**
   * เวลาเรียน
   */
  STUDY_TIME = 'เวลาเรียน',
  /**
   * คุณลักษณะอันพึงประสงค์
   */
  DESIRED_TRAITS = 'คุณลักษณะอันพึงประสงค์',
  /**
   * สมรรถนะ
   */
  COMPETENCY = 'สมรรถนะ',
  /**
   * กิจกรรมพัฒนาผู้เรียน
   */
  STUDENT_DEVELOPMENT = 'กิจกรรมพัฒนาผู้เรียน',
  /**
   * ภาวะโภชนาการ
   */
  NUTRITIONAL_STATUS = 'ภาวะโภชนาการ',
}

export enum EEvaluationKey {
  STAGE_LIST = 'STAGE_LIST',
}
