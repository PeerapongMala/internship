package huaweiObs

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/google/uuid"
	obs "github.com/huaweicloud/huaweicloud-sdk-go-obs/obs"
	"github.com/pkg/errors"
)

func (huaweiObsRepository *huaweiObsRepository) ObjectCaseGenerateSignedUrl(objectKey string) (*string, error) {
	if huaweiObsRepository.ObsClient == nil {
		signedUrl := fmt.Sprintf(`https://%s.obs.ap-southeast-1.myhuaweicloud.com/%s`, "my-bucket-name", objectKey)
		return &signedUrl, nil
	}

	_, err := uuid.Parse(objectKey)
	//if err != nil && !strings.Contains(objectKey, ".fbx") {
	//	return &objectKey, nil
	//}
	if err != nil && !strings.Contains(objectKey, ".fbx") && !strings.Contains(objectKey, ".zip") && !strings.Contains(objectKey, "Artwork") {
		return &objectKey, nil
	}
	bucketName := os.Getenv("OBS_BUCKET_NAME")
	lifetimeString := os.Getenv("OBS_PRESIGNED_URL_LIFETIME")
	lifetime, err := strconv.Atoi(lifetimeString)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	input := &obs.CreateSignedUrlInput{
		Method:  obs.HttpMethodGet,
		Bucket:  bucketName,
		Key:     objectKey,
		Expires: lifetime,
	}

	createSignedUrlOutput, err := huaweiObsRepository.ObsClient.CreateSignedUrl(input)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &createSignedUrlOutput.SignedUrl, nil
}
