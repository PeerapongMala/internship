package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/google/uuid"
	"io"
	"net/http"
)

type DownloadFileInput struct {
	KeysToAdd map[string]struct {
		Bytes    []byte
		FileType string
	}
	ImagesToDownload map[string]struct {
		Url                     string
		ColumnNumber, RowNumber int
	}
	Url          string
	FileType     string
	RowNumber    int
	ColumnNumber int
}

type DownloadFileOutput struct {
	Key string
}

func (service *serviceStruct) DownloadFile(in *DownloadFileInput) (*DownloadFileOutput, error) {
	body := []byte{}
	key := uuid.NewString()

	if in.ImagesToDownload == nil {
		response, err := http.Get(in.Url)
		if err != nil || response.StatusCode != http.StatusOK {
			msg := fmt.Sprintf(`Failed to fetch file from URL at column %d of row %d`, in.ColumnNumber+1, in.RowNumber)
			return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		defer response.Body.Close()

		body, err = io.ReadAll(response.Body)
		if err != nil {
			msg := fmt.Sprintf(`Failed to read content of file from URL at column %d of row %d`, in.ColumnNumber+1, in.RowNumber)
			return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		in.KeysToAdd[key] = struct {
			Bytes    []byte
			FileType string
		}{Bytes: body, FileType: in.FileType}
	} else {
		in.ImagesToDownload[key] = struct {
			Url                     string
			ColumnNumber, RowNumber int
		}{
			Url:          in.Url,
			ColumnNumber: in.ColumnNumber,
			RowNumber:    in.RowNumber,
		}
	}

	return &DownloadFileOutput{key}, nil
}
