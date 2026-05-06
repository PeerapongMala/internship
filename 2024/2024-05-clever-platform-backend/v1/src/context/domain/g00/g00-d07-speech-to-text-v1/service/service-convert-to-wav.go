package service

import (
	"bytes"
	"github.com/go-audio/wav"
	"github.com/pkg/errors"
	"io"
	"log"
	"mime/multipart"
)

func (service *serviceStruct) ConvertToWav(audioFile *multipart.FileHeader) (*string, error) {
	file, err := audioFile.Open()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	defer file.Close()

	fileData, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}

	buffer := bytes.NewReader(fileData)

	decoder := wav.NewDecoder(buffer)
	buf, err := decoder.FullPCMBuffer()
	if err != nil {
		return nil, err
	}
	log.Println(buf)

	return nil, nil
}
