package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
)

type ServiceInterface interface {
	// GradeTemplate
	GradeTemplateList(in *GradeTemplateListInput) (*GradeTemplateListOutput, error)
	GradeTemplateCreate(in *GradeTemplateCreateRequest) (*constant.GradeTemplateWithSubject, error)
	GradeTemplateUpdate(in *GradeTemplateUpdateRequest) error
	GradeTemplateUpdateDetail(in *GradeTemplateUpdateDetailRequest) error
	GradeTemplateGet(id int) (*constant.GradeTemplateWithSubject, error)
	GradeSubjectGet(id int) ([]constant.GradeSubjectWithIndicator, error)
	GradeSubjectUpdate(in *GradeSubjectUpdateRequest) error
	GradeSubjectDelete(id int) error
	GradeIndicatorGet(id int) (*constant.GradeIndicatorWithAssesmentSetting, error)
	GradeIndicatorUpdate(in *GradeIndicatorUpdateRequest) error

	// GeneralTempalte
	GradeGeneralTemplateList(in *GradeGeneralTemplateListInput) (*GradeGeneralTemplateListOutput, error)
	GradeGeneralTemplateCreate(in *GradeGeneralTemplateCreateRequest) error
	GradeGeneralTemplateGet(id int) (*GradeGeneralTemplateGetOutput, error)
	GradeGeneralTemplateUpdate(in *GradeGeneralTemplateUpdateRequest) error

	//drop-down
	YearList(in *YearListInput) (*YearListOutput, error)
	DropDownGeneralTemplateList(in *GeneralTemplateListInput) (*GeneralTemplateListOutput, error)
	IndicatorList(in *IndicatorListInput) (*IndicatorListOutput, error)
}
