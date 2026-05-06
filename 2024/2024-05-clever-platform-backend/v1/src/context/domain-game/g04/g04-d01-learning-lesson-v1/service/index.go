package service

import (
	learningLessonStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/storage/storage-repository"
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
)

type serviceStruct struct {
	learningLessonStorage learningLessonStorageRepository.Repository
	authStorage           authStorageRepository.Repository
}

func ServiceNew(learningLessonStorage learningLessonStorageRepository.Repository, authStorage authStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		learningLessonStorage: learningLessonStorage,
		authStorage:           authStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
