package service

import (
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	teacherRewardStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/storage/storage-repository"
)

type serviceStruct struct {
	teacherRewardStorage teacherRewardStorageRepository.TeacherRewardRepository
	authStorage          authStorageRepository.Repository
	cloudStorage         cloudStorageRepository.Repository
}

func ServiceNew(teacherRewardStorage teacherRewardStorageRepository.TeacherRewardRepository, authStorage authStorageRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		teacherRewardStorage: teacherRewardStorage,
		authStorage:          authStorage,
		cloudStorage:         cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
