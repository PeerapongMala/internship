package thirdPartyStorage

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"reflect"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

// func (huaweiObsRepository *huaweiObsRepository) ObjectCreate(object *multipart.FileHeader, objectKey string, fileType string) error {
func (thirdPartyStorageRepository *thirdPartyStorageRepository) ObjectCreate(data interface{}, objectKey string, fileType string) error {
	if thirdPartyStorageRepository.ThirdPartyStorageClient == nil || data == nil || reflect.ValueOf(data).IsNil() {
		return nil
	}

	_, err := uuid.Parse(objectKey)
	if err != nil && fileType != constant.Zip {
		return nil
	}

	bucketName := os.Getenv("THIRD_PARTY_STORAGE_BUCKET_NAME")

	input := &s3.PutObjectInput{}
	input.Bucket = &bucketName
	input.Key = &objectKey

	switch v := data.(type) {
	case *multipart.FileHeader:
		file, err := v.Open()
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		defer file.Close()

		fileSize, err := file.Seek(0, io.SeekEnd)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		_, err = file.Seek(0, io.SeekStart)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}

		buffer := make([]byte, fileSize)
		_, err = file.Read(buffer)
		if err != nil && err != io.EOF {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		contentType := http.DetectContentType(buffer[:512])

		input.Body = bytes.NewReader(buffer)
		if strings.Contains(contentType, "text/xml") && fileType == constant.Image {
			input.ContentType = helper.ToPtr("image/svg+xml")
		} else if fileType == constant.Image {
			input.ContentType = helper.ToPtr(fileType)
		}
	case []byte:
		input.Body = bytes.NewReader(v)
		if fileType == constant.Speech {
			input.ContentType = helper.ToPtr("audio/mpeg")
		}
		if fileType == constant.Zip {
			input.ContentType = helper.ToPtr("application/zip")
		}
		if fileType == constant.Image {
			bytes, ok := data.([]byte)
			if !ok {
				msg := fmt.Sprintf("Failed to save image")
				return helper.NewHttpError(http.StatusInternalServerError, &msg)
			}
			contentType := http.DetectContentType(bytes)
			if strings.Contains(contentType, "text/xml") {
				input.ContentType = helper.ToPtr("image/svg+xml")
			} else {
				input.ContentType = &contentType
			}
		}
	}

	uploader := manager.NewUploader(thirdPartyStorageRepository.ThirdPartyStorageClient, func(u *manager.Uploader) {
		u.PartSize = 15 * 1024 * 1024
	})
	_, err = uploader.Upload(context.TODO(), input)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
