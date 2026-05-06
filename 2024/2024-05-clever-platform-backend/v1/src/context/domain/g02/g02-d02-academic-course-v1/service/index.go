package service

import (
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	academicCourseStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/storage/storage-repository"
)

type serviceStruct struct {
	academicCourseStorage academicCourseStorageRepository.Repository
	authStorage           authStorageRepository.Repository
	cloudStorage          cloudStorageRepository.Repository
}

func ServiceNew(academicCourseStorage academicCourseStorageRepository.Repository, authStorage authStorageRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		academicCourseStorage: academicCourseStorage,
		authStorage:           authStorage,
		cloudStorage:          cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
