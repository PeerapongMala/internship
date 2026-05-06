package service

import (
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	academicSubLessonStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/storage/storage-repository"
)

type serviceStruct struct {
	academicSubLessonStorage academicSubLessonStorageRepository.Repository
	authStorage              authStorageRepository.Repository
}

func ServiceNew(academicSubLessonStorage academicSubLessonStorageRepository.Repository, authStorage authStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		academicSubLessonStorage: academicSubLessonStorage,
		authStorage:              authStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
