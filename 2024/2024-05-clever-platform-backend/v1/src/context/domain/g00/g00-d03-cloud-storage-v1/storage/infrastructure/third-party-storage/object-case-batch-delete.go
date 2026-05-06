package thirdPartyStorage

import (
	"context"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

func (thirdPartyStorageRepository *thirdPartyStorageRepository) ObjectCaseBatchDelete(objectKeys []string) error {
	if len(objectKeys) == 0 {
		return nil
	}

	bucketName := os.Getenv("THIRD_PARTY_STORAGE_BUCKET_NAME")

	objects := make([]types.ObjectIdentifier, len(objectKeys))
	for i, objectKey := range objectKeys {
		objects[i] = types.ObjectIdentifier{
			Key: aws.String(objectKey),
		}
	}

	_, err := thirdPartyStorageRepository.ThirdPartyStorageClient.DeleteObjects(context.TODO(), &s3.DeleteObjectsInput{
		Bucket: aws.String(bucketName),
		Delete: &types.Delete{
			Objects: objects,
			Quiet:   aws.Bool(true),
		},
	})
	if err != nil {
		return err
	}

	return nil
}
