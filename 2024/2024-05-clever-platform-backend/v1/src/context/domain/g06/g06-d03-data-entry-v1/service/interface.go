package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"

type ServiceInterface interface {
	EvaluationSheetList(in *EvaluationSheetListInput) (*EvaluationSheetListOutput, error)
	EvaluationSheetGet(in *EvaluationSheetGetRequest) (*EvaluationSheetGetData, error)
	EvaluationSheetUpdate(in *EvaluationSheetUpdateRequest) (*EvaluationSheetUpdateData, error)
	EvaluationNoteAdd(in *EvaluationNoteAddRequest) error
	EvaluationNoteGet(in *EvaluationNoteGetRequest) ([]constant.EvaluationFormNote, error)
	EvaluationSheetHistoryList(in *EvaluationSheetHistoryListInput) (*EvaluationSheetHistoryListOutput, error)
	EvaluationSheetHistoryCompare(in *EvaluationSheetHistoryCompareRequest) (*EvaluationSheetHistoryCompareData, error)
	EvaluationSheetRetrieveVersion(in *EvaluationSheetRetrieveVersionRequest) (*EvaluationSheetRetrieveVersionData, error)
	SeedAcademicYearList(*SeedAcademicYearListInput) (*SeedAcademicYearListOutput, error)
	SeedYearList() (*SeedYearListOutput, error)
	ClassList(in *ClassListInput) (*ClassListOutput, error)
	SubjectList(in *SubjectListInput) (*SubjectListOutput, error)
	EvaluationSheetGetSubject(in *EvaluationSheetGetSubjectInput) (*EvaluationSheetGetSubjectOutput, error)
	SortScore(playLogMap map[int]map[int]map[string][]constant.GradeSettingScore)
	EvaluationFormSettingGetScore(in *EvaluationFormSettingGetScoreInput) (*EvaluationFormSettingGetScoreOutput, error)

	// service
	ConvertLevelType(cleverLevelType string, difficulty string) string
}
