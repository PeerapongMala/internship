package huaweiObs

import (
	"errors"
	"github.com/huaweicloud/huaweicloud-sdk-go-obs/obs"
	"net/http"
	"os"
)

func (huaweiObsRepository *huaweiObsRepository) ObjectCaseCheckExistence(objectKey string) (bool, error) {
	bucketName := os.Getenv("OBS_BUCKET_NAME")

	input := &obs.GetObjectMetadataInput{
		Bucket: bucketName,
		Key:    objectKey,
	}

	_, err := huaweiObsRepository.ObsClient.GetObjectMetadata(input)
	if err != nil {
		var obsError obs.ObsError
		if errors.As(err, &obsError) {
			if obsError.StatusCode == http.StatusNotFound {
				return false, nil
			}
		}
		return false, err
	}

	return true, nil
}
