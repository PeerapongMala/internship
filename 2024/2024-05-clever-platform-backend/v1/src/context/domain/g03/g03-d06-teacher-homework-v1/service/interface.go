package service

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
)

type ServiceInterface interface {
	SubjectList(in *SubjectListInput) (*SubjectListOutput, error)
	HomeworkTemplateList(in *HomeworkTemplateListInput) (*HomeworkTemplateListOutput, error)
	HomeworkList(in *HomeworkListInput) (*HomeworkListOutput, error)
	GetHomeworkStudentStat(homeworkId int, schoolId int, seedYearIds, studentGroupIds, classIds []int, dueAt time.Time) (*constant.HomeworkStatDTO, error)

	HomeworkTemplateCreate(in *HomeworkTemplateCreateRequest) error
	HomeworkTemplateUpdate(in *HomeworkTemplateUpdateRequest) error
	HomeworkTemplateGet(in *HomeworkTemplateGetRequest) (*constant.HomeworkTemplateEntity, error)
	SubLessonLevelGet(in *SubLessonLevelGetInput) (*SubLessonLevelGetOutput, error)
	LessonList(in *LessonListInput) (*LessonListOutput, error)
	HomeworkTemplateBulkEdit(in *HomeworkTemplateBulkEditRequest) error

	HomeworkCreate(in *HomeworkCreateRequest) error
	HomeworkUpdate(in *HomeworkUpdateRequest) error
	HomeworkGet(in *HomeworkGetRequest) (*constant.HomeworkEntity, error)
	HomeworkBulkEdit(in *HomeworkBulkEditRequest) error
	HomeworkAssignToTargetList(in *HomeworkAssignToTargetListInput) (*HomeworkAssignToTargetListOutput, error)

	HomeworkDetailList(in *HomeworkDetailListInput) (*HomeworkDetailListOutput, error)
	HomeworkSubmitDetailList(in *HomeworkSubmitDetailListInput) (*HomeworkSubmitDetailListOutput, error)
	HomeworkStudentListList(in *HomeworkStudentListListInput) (*HomeworkStudentListListOutput, error)

	YearList(in *YearListInput) (*YearListOutput, error)
	ClassList(in *ClassListInput) (*ClassListOutput, error)
}
