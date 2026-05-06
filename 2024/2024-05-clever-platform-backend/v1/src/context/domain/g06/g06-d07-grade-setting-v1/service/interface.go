package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"

type ServiceInterface interface {
	StudentInformationCsvUpload(req *StudentInformationUploadCsvRequest) error
	StudentInformationCsvDownload(req *StudentInformationDownloadCsvRequest) ([]byte, error)
	StudentInformationList(in *StudentInformationListRequest) ([]constant.GradeEvaluationStudentFilterResult, error)
	StudentInformationGet(studentID int) (*constant.EvaluationStudent, error)
	StudentInformationUpdate(in *StudentInformationUpdateRequest) error
	StudentAddressList(in *StudentAddressListRequest) ([]constant.StudentAddressResult, error)
	DocumentTemplateUpdate(in *DocumentTemplateUpdateRequest) (*DocumentTemplateUpdateData, error)
	DocumentTemplateList(in *DocumentTemplateListRequest) ([]constant.GradeDocumentTemplate, error)
	DocumentTemplateCreate(in *DocumentTemplateCreateRequest) error
}
