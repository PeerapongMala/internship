package service

import googleSpeechToTextRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d07-speech-to-text-v1/storage/storage-repository"

type serviceStruct struct {
	googleSpeechToTextStorage googleSpeechToTextRepository.Repository
}

func ServiceNew(googleSpeechToTextStorage googleSpeechToTextRepository.Repository) ServiceInterface {
	return &serviceStruct{
		googleSpeechToTextStorage: googleSpeechToTextStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
