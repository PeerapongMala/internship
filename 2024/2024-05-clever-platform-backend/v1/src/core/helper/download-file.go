package helper

import (
	"errors"
	"io"
	"net/http"
)

func DownloadImageFileFromUrl(url *string) ([]byte, string, error) {

	response, err := http.Get(*url)
	if err != nil || response.StatusCode != http.StatusOK {
		return nil, "", errors.New("failed to fetch file from cloud storage")
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, "", errors.New("failed to read file content")
	}

	contentType := response.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	return body, contentType, nil
}
