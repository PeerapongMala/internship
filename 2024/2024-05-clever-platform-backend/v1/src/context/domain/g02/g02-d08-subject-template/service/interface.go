package service

type ServiceInterface interface {
	SubjectTemplateCreate(in *SubjectTemplateCreateInput) (*SubjectTemplateCreateOutput, error)
	SubjectTemplateList(in *SubjectTemplateListInput) (*SubjectTemplateListOutput, error)
	SubjectTemplateUpdate(in *SubjectTemplateUpdateInput) error
	SubjectTemplateCaseBulkEdit(in *SubjectTemplateCaseBulkEditInput) error
	SubjectTemplateIndicatorGet(in *SubjectTemplateIndicatorGetInput) (*SubjectTemplateIndicatorGetOutput, error)
}
