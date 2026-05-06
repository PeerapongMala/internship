package storagerepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/constant"
)

type Repository interface {
	GetStudentIdsByStudentGroupIdAndTeacherId(studyGroupId int, teacherId string) ([]string, error)
	GetTTestPairModelStatListByParams(studentIds []string, in *constant.GetTTestPairModelStatListAndCsvParams) ([]constant.TTestPairModelStatEntity, error)
	GetPrePostTestLevelIDByStudyGroup(studyGroupID int) (*int, error)
	GetQuestionStatByLevelIDAndStudentIds(levelID int, studentIds []string, searchStr *string) ([]constant.StudentQuestionStatEntity, error)
	GetStudentNameById(studentId string) (*string, error)
	GetStudentStatByStudentIds(levelID int, studentIds []string) ([]constant.PrePostTestStudentByStudentStatEntity, error)
	GetLevelsBySubLessonId(subLessonId int) ([]constant.LevelParamsEntity, error)
	GetLevelQuestionCount(levelId int) (count int, err error)
}
