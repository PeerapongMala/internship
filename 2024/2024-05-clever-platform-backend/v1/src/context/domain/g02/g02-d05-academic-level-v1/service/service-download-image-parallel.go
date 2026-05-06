package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"io"
	"net/http"
	"sync"
)

type DownloadImageParallelInput struct {
	ImagesToDownload map[string]struct {
		Url                     string
		ColumnNumber, RowNumber int
	}
}

func (service *serviceStruct) DownloadImageParallel(in DownloadImageParallelInput) error {
	var wg sync.WaitGroup
	errChan := make(chan error, len(in.ImagesToDownload))

	for key, data := range in.ImagesToDownload {
		wg.Add(1)

		go func(key string, data struct {
			Url          string
			ColumnNumber int
			RowNumber    int
		}) {
			defer wg.Done()

			resp, err := http.Get(data.Url)
			if err != nil || resp.StatusCode != http.StatusOK {
				msg := fmt.Sprintf("Failed to fetch file from URL at column %d of row %d",
					data.ColumnNumber+1, data.RowNumber)
				errChan <- helper.NewHttpError(http.StatusBadRequest, &msg)
				return
			}
			defer resp.Body.Close()

			body, err := io.ReadAll(resp.Body)
			if err != nil {
				msg := fmt.Sprintf("Failed to read content of file from URL at column %d of row %d",
					data.ColumnNumber+1, data.RowNumber)
				errChan <- helper.NewHttpError(http.StatusBadRequest, &msg)
				return
			}

			err = service.cloudStorage.ObjectCreate(body, key, constant.Image)
			if err != nil {
				errChan <- err
				return
			}

		}(key, data)
	}

	go func() {
		wg.Wait()
		close(errChan)
	}()

	for err := range errChan {
		if err != nil {
			return err
		}
	}

	return nil
}
