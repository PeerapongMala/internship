package service

import (
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	academicLessonStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/storage/storage-repository"
)

type serviceStruct struct {
	academicLessonStorage academicLessonStorageRepository.Repository
	authStorage           authStorageRepository.Repository
}

func ServiceNew(academicLessonStorage academicLessonStorageRepository.Repository, authStorage authStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		academicLessonStorage: academicLessonStorage,
		authStorage:           authStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
