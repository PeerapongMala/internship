package thirdPartyStorage

import (
	"fmt"
	"net/url"
	"os"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/google/uuid"
)

func (thirdPartyStorageRepository *thirdPartyStorageRepository) ObjectCaseGenerateSignedUrl(objectKey string) (*string, error) {
	if thirdPartyStorageRepository.ThirdPartyStorageClient == nil {
		signedUrl := fmt.Sprintf(`https://%s.cloudflarestorage.com/%s`, "my-bucket-name", objectKey)
		return &signedUrl, nil
	}

	objectKey, err := url.QueryUnescape(objectKey)
	if err != nil {
		return nil, err
	}

	_, err = uuid.Parse(objectKey)
	if err != nil && !strings.Contains(objectKey, ".fbx") && !strings.Contains(objectKey, ".zip") && !strings.Contains(objectKey, "Artwork") {
		return &objectKey, nil
	}

	endpoint := os.Getenv("THIRD_PARTY_STORAGE_READ_ENDPOINT")
	//lifetimeString := os.Getenv("THIRD_PARTY_STORAGE_PRESIGNED_URL_LIFETIME")
	//lifetime, err := strconv.Atoi(lifetimeString)
	//if err != nil {
	//	log.Printf("%+v", errors.WithStack(err))
	//	return nil, err
	//}
	//
	//presignClient := s3.NewPresignClient(thirdPartyStorageRepository.ThirdPartyClient)
	//presignedRequest, err := presignClient.PresignGetObject(context.TODO(),
	//	&s3.GetObjectInput{
	//		Bucket: aws.String(bucketName),
	//		Key:    aws.String(objectKey),
	//	},
	//	s3.WithPresignExpires(time.Duration(lifetime)*time.Second),
	//)
	//if err != nil {
	//	return nil, err
	//}

	//return &presignedRequest.URL, nil
	return helper.ToPtr(fmt.Sprintf(`%s/%s`, endpoint, objectKey)), nil
}
