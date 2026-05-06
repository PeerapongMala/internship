package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	SubjectLessonList(in *SubjectLessonListInput) (*SubjectLessonListOutput, error)
	SubjectLessonCreate(request *constant.SubjectLessonCreateRequest) (*constant.SubjectLessonResponse, error)
	SubjectLessonUpdate(request *constant.SubjectLessonPatchRequest) (*constant.SubjectLessonResponse, error)

	LessonGet(in *LessonGetInput) (*LessonGetOutput, error)
	LessonCaseSort(in *LessonCaseSortInput) error
	LessonCaseDownloadCsv(in *LessonCaseDownloadCsvInput) (*LessonCaseDownloadCsvOutput, error)
	LessonCaseUploadCsv(in *LessonCaseUploadCsvInput) error
	LessonCaseBulkEdit(in *LessonCaseBulkEditInput) error

	GetLessonMonsterByLessonID(request LessonMonsterGetListRequest, pagination *helper.Pagination) ([]constant.LessonMonsterImageEntity, int, error)
	CreateLessonMonsterBulkByLessonID(request LessonMonsterCreateRequest) error
	DeleteLessonMonsterBulkByID(monsterIDs []int) error
	LessonCaseGetMeta(in *LessonCaseGetMetaRequest) ([]constant.LessonMetaEntity, error)
}
