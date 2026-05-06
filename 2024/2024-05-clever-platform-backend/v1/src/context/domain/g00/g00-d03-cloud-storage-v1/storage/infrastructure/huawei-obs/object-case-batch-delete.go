package huaweiObs

import (
	"github.com/huaweicloud/huaweicloud-sdk-go-obs/obs"
	"github.com/pkg/errors"
	"log"
	"os"
)

func (huaweiObsRepository *huaweiObsRepository) ObjectCaseBatchDelete(objectKeys []string) error {
	if len(objectKeys) == 0 {
		return nil
	}

	bucketName := os.Getenv("OBS_BUCKET_NAME")

	objects := []obs.ObjectToDelete{}
	for _, objectKey := range objectKeys {
		objects = append(objects, obs.ObjectToDelete{Key: objectKey})
	}

	input := &obs.DeleteObjectsInput{
		Bucket:  bucketName,
		Objects: objects,
	}

	_, err := huaweiObsRepository.ObsClient.DeleteObjects(input)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
