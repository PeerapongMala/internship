package thirdPartyStorage

import (
	"mime/multipart"
)

func (thirdPartyStorageRepository *thirdPartyStorageRepository) ObjectUpdate(object *multipart.FileHeader, objectKey string) error {
	// bucketName := os.Getenv("OBS_BUCKET_NAME")

	// file, err := object.Open()
	// if err != nil {
	// 	log.Printf("%+v", errors.WithStack(err))
	// 	return err
	// }

	// input := &obs.PutObjectInput{}
	// input.Bucket = bucketName
	// input.Key = objectKey
	// input.Body = file

	// _, err = huaweiObsRepository.ObsClient.PutObject(input)
	// if err != nil {
	// 	log.Printf("%+v", errors.WithStack(err))
	// 	return err
	// }

	return nil
}
