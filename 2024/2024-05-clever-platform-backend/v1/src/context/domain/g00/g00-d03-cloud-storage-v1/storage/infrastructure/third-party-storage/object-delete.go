package thirdPartyStorage

import (
	"context"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func (thirdPartyStorageRepository *thirdPartyStorageRepository) ObjectDelete(objectKey string) error {
	if thirdPartyStorageRepository.ThirdPartyStorageClient == nil || objectKey == "" {
		return nil
	}

	bucketName := os.Getenv("THIRD_PARTY_STORAGE_BUCKET_NAME")

	_, err := thirdPartyStorageRepository.ThirdPartyStorageClient.DeleteObject(context.TODO(), &s3.DeleteObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(objectKey),
	})
	if err != nil {
		return err
	}

	return nil
}
