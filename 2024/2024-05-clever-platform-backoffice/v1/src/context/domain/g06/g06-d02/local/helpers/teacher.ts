import { EResponsibleTeacherType } from '../enums/evaluation';
import { TTeacherUser } from '../types/admin';
import { TResponsiblePersonData } from '../types/grade';

export function mapTeacherUserToResponsiblePersonData(
  teachers: TTeacherUser[],
  userType: EResponsibleTeacherType,
): TResponsiblePersonData[] {
  return teachers.map((teacher) => {
    const teachers: TResponsiblePersonData = {
      ...teacher,
      user_id: teacher.id,
      email: teacher.email,
      user_type: userType,
    };

    return teachers;
  });
}
