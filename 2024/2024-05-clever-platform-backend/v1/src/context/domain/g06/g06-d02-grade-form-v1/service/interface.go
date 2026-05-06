package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"

type ServiceInterface interface {
	GradeEvaluationFormList(in *GradeFormListInput) (*GradeFormListOutput, error)
	GradeEvaluationFormCreate(in *GradeEvaluationCreateRequest) (*constant.GradeEvaluationFormEntity, error)
	GradeEvaluationFormGet(id int) (*GradeEvaluationFormGetOutput, error)
	GradeEvaluationFormUpdate(in *GradeEvaluationFormUpdateRequest) error
	GradeEvaluationFormBulkUpdate(in *GradeEvaluationFormBulkUpdateRequest) error
	GradeEvaluationFormDownloadCsv(in GradeFormListInput) (*GradeFormDownloadCsvOutput, error)
	GradeEvaluationFormSubmit(in *GradeEvaluationFormSubmitRequest) error
	SchoolCsvUpload(req GradeFormUploadCsvInput) error
	GradeTemplateList(in *GradeTemplateListInput) (*GradeTemplateListOutput, error)
	EvaluationSheetList(in *EvaluationSheetListInput) (*EvaluationSheetListOutput, error)
	EvaluationSheetUpdate(in *EvaluationSheetUpdateRequest) error

	AdditionalPersonGet(id int) (*AdditionalPersonGetOutput, error)
	AdditionalPersonPut(in *AdditionalPersonPutRequest) error

	GradeSubjectGet(id int) (*GradeSubjectGetOutput, error)
	GradeSubjectUpsert(in *GradeSubjectUpsertRequest) error
	GradeSubjectIndicatorUpdate(in *GradeSubjectIndicatorUpdateRequest) (*constant.GradeEvaluationFormIndicatorEntity, error)
	GradeEvaluationFormCloneTemplate(in *GradeEvaluationFormCloneTemplateInput) error
	GradeTemplateClone(in *GradeTemplateCloneInput) error
}
