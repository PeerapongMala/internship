package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"

type ServiceInterface interface {
	AdminProgressGetSchoolTeachers(in *AdminProgressGetSchoolTeachersInput) (out []constant.AdminReportTeacherStats, err error)
	AdminProgressGetSchoolTeacherClassroom(in *AdminProgressGetSchoolTeacherClassroomInput) (out []constant.ProgressReport, err error)
	AdminProgressGetSchoolClasses(in *AdminProgressGetSchoolClassesInput) (out []constant.ProgressReport, err error)
	SchoolList(in *SchoolListInput) (*SchoolListOutput, error)

	BestStudentList(in *BestStudentListInput) (*BestStudentListOutput, error)
	BestTeacherListByClassStars(in *BestTeacherListByClassStarsInput) (*BestTeacherListByClassStarsOutput, error)
	BestTeacherListByStudyGroupStars(in *BestTeacherListByStudyGroupStarsInput) (*BestTeacherListByStudyGroupStarsOutput, error)
	BestTeacherListByHomework(in *BestTeacherListByHomeworkInput) (*BestTeacherListByHomeworkOutput, error)
	BestTeacherListByLesson(in *BestTeacherListByLessonInput) (*BestTeacherListByLessonOutput, error)
	BestSchoolListByAvgClassStars(in *BestSchoolListByAvgClassStarsInput) (*BestSchoolListByAvgClassStarsOutput, error)
}
