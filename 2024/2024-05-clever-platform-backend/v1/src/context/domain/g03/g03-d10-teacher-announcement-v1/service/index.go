package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	announceStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/storage/storage-repository"
)

func ServiceNew(announceStorage announceStorage.TeacherAnnounceRepository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		TeacherannounceStorage: announceStorage,
		cloudStorage:           cloudStorage,
	}
}

type serviceStruct struct {
	TeacherannounceStorage announceStorage.TeacherAnnounceRepository
	cloudStorage           cloudStorageRepository.Repository
}

type APIStruct struct {
	Service ServiceInterface
}
