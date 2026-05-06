package storageRepository

import "mime/multipart"

type Repository interface {
	ObjectCreate(object interface{}, objectKey string, fileType string) error
	ObjectUpdate(object *multipart.FileHeader, objectKey string) error
	ObjectDelete(objectKey string) error
	ObjectCaseBatchDelete(objectKeys []string) error
	ObjectCaseGenerateSignedUrl(objectKey string) (*string, error)
	ObjectCaseCheckExistence(objectKey string) (bool, error)
}
