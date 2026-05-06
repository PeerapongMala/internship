package thirdPartyStorage

import (
	"context"
	"errors"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

func (thirdPartyStorageRepository *thirdPartyStorageRepository) ObjectCaseCheckExistence(objectKey string) (bool, error) {
	bucketName := os.Getenv("THIRD_PARTY_STORAGE_BUCKET_NAME")

	_, err := thirdPartyStorageRepository.ThirdPartyStorageClient.HeadObject(context.TODO(), &s3.HeadObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(objectKey),
	})

	var notFoundErr *types.NotFound
	if errors.As(err, &notFoundErr) {
		return false, nil
	} else if err != nil {
		return false, err
	}

	return true, nil
}
