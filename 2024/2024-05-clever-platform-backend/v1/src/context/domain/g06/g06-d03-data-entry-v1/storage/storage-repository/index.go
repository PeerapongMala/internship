package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	EvaluationSheetGetById(id int) (*constant.EvaluationSheetEntity, error)
	EvaluationSheetGetDetailById(id int) (*constant.EvaluationSheetDetail, error)
	EvaluationSheetList(tx *sqlx.Tx, filter constant.EvaluationSheetListFilter, pagination *helper.Pagination) ([]constant.EvaluationSheetListEntity, error)
	EvaluationSheetUpdateCurrentDataEntryID(tx *sqlx.Tx, id int, dataEntryID int) error

	GetEvaluationDataBySheetId(sheetID int, version string) (*constant.EvaluationDataEntry, error)
	EvaluationDataEntryInsert(tx *sqlx.Tx, entity *constant.EvaluationDataEntry) (insertId int, err error)
	EvaluationFormNoteInsert(tx *sqlx.Tx, entity *constant.EvaluationFormNote) (insertId int, err error)
	GetListEvaluationFormNoteBySheetId(sheetID int) ([]constant.EvaluationFormNote, error)
	EvaluationDataEntryListBySheetID(sheetID int, pagination *helper.Pagination) ([]constant.EvaluationSheetHistoryListEntity, error)
	EvaluationDataEntryListNoDetails(sheetID int, pagination *helper.Pagination) ([]constant.EvaluationSheetHistoryListNoDetailsEntity, error)
	GetListEvaluationStudentBySheetID(sheetID int) ([]constant.EvaluationStudentEntity, error)
	GetListStudentScoreBySheetID(sheetID int, indicatorId ...*int) ([]constant.StudentScore, error)

	SeedAcademicYearList(teacherId string) ([]int, error)
	ClassList(seedYearShortName string, schoolId, academicYear int) ([]string, error)
	SeedYearList() ([]string, error)
	SubjectList(schoolId int, academicYear string) ([]string, error)
	AcademicYearRangeGet(schoolId int, academicYear string) (academicYearRange *constant.AcademicYearRange, err error)

	EvaluationFormGeneralEvaluationUpdate(tx *sqlx.Tx, in *constant.GradeEvaluationFormGeneralEvaluationEntity) error
	EvaluationSheetGetSubject(sheetId int) (*constant.SheetSubject, error)
	GradeSettingList(sheetId int, indicatorId int) ([]constant.GradeEvaluationFormIndicatorEntity, error)
	GradeSettingGetStudentScore(students []int, subLessonIds []int, schoolId int) ([]constant.GradeSettingScore, error)
	SubLessonCaseListLevel(subLessonIds []int) ([]constant.SubLessonLevel, error)
	GeneralSheetListBySubject(formId int, evaluationFormSubjectId int) ([]constant.SubjectGeneralEvaluation, error)
}
