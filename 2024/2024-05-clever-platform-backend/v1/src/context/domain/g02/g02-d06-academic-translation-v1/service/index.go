package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	textToSpeechStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d04-text-to-speech-v1/storage/storage-repository"
	translateStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d05-translate-v1/storage/storage-repository"
	academicLevelStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/storage/storage-repository"
	academicTranslationStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/storage/storage-repository"
)

type serviceStruct struct {
	academicTranslationStorage academicTranslationStorageRepository.Repository
	academicLevelStorage       academicLevelStorageRepository.Repository
	cloudStorage               cloudStorageRepository.Repository
	textToSpeechStorage        textToSpeechStorageRepository.Repository
	translateStorage           translateStorageRepository.Repository
}

func ServiceNew(academicTranslationStorage academicTranslationStorageRepository.Repository, academicLevelStorage academicLevelStorageRepository.Repository, cloudStorage cloudStorageRepository.Repository, textToSpeechStorage textToSpeechStorageRepository.Repository, translateStorage translateStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		academicLevelStorage:       academicLevelStorage,
		academicTranslationStorage: academicTranslationStorage,
		cloudStorage:               cloudStorage,
		textToSpeechStorage:        textToSpeechStorage,
		translateStorage:           translateStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
