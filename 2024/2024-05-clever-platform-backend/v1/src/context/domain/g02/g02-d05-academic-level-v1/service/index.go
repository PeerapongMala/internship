package service

import (
	academicStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/storage/storage-repository"

	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	translateStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d05-translate-v1/storage/storage-repository"

	textToSpeechStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d04-text-to-speech-v1/storage/storage-repository"
)

type serviceStruct struct {
	academicLevelStorage academicStorageRepository.Repository
	cloudStorage         cloudStorageRepository.Repository
	textToSpeechStorage  textToSpeechStorageRepository.Repository
	translateStorage     translateStorageRepository.Repository
}

func ServiceNew(academicLevelStorage academicStorageRepository.Repository, cloudStorage cloudStorageRepository.Repository, textToSpeechStorage textToSpeechStorageRepository.Repository, translateStorage translateStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		academicLevelStorage: academicLevelStorage,
		cloudStorage:         cloudStorage,
		textToSpeechStorage:  textToSpeechStorage,
		translateStorage:     translateStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
