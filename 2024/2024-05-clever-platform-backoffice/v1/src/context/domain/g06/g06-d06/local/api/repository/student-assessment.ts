import { AssessmentDto } from '../../type';

export interface StudentAssessmentRepository {
  GetAssessment: () => Promise<AssessmentDto>;
}
