package huaweiObs

import (
	"log"
	"os"

	obs "github.com/huaweicloud/huaweicloud-sdk-go-obs/obs"
	"github.com/pkg/errors"
)

func (huaweiObsRepository *huaweiObsRepository) ObjectDelete(objectKey string) error {
	if huaweiObsRepository.ObsClient == nil || objectKey == "" {
		return nil
	}

	bucketName := os.Getenv("OBS_BUCKET_NAME")

	input := &obs.DeleteObjectInput{
		Bucket: bucketName,
		Key:    objectKey,
	}

	_, err := huaweiObsRepository.ObsClient.DeleteObject(input)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
