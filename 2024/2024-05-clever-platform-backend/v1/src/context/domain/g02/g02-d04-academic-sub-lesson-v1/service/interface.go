package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	SubjectSubLessonCreate(request *constant.SubjectSubLessonRequest) (*constant.SubjectSubLessonResponse, error)
	SubjectSubLessonUpdate(request *constant.SubjectSubLessonRequest) (*constant.SubjectSubLessonResponse, error)
	SubjectSubLessonList(pagination *helper.Pagination, lessonId int, filter constant.SubLessonListFilter) (*[]constant.SubjectSubLessonListResponse, error)

	SubLessonGet(in *SubLessonGetInput) (*SubLessonGetOutput, error)
	SubLessonCaseSort(in *SubLessonCaseSortInput) error
	SubLessonCaseDownloadCsv(in *SubLessonCaseDownloadCsvInput) (*SubLessonCaseDownloadCsvOutput, error)
	SubLessonCaseUploadCsv(in *SubLessonCaseUploadCsvInput) error
	SubLessonCaseBulkEdit(in *SubLessonCaseBulkEditInput) error
}
