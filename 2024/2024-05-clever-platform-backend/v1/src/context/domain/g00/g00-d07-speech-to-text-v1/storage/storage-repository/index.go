package storageRepository

import "mime/multipart"

type Repository interface {
	GoogleSpeechToTextCaseTranscribe(targetLanguage string, audioFile *multipart.FileHeader) (*string, error)
}
