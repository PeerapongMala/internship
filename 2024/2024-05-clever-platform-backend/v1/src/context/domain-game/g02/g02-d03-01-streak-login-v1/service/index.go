package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	subjectCheckinStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/storage/storage-repository"
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
)

type DataGetResponse struct {
	Data    []constant.SubjectCheckinEntity `json:"data"`
	Message string                          `json:"message"`
}

type serviceStruct struct {
	subjectCheckinStorage subjectCheckinStorageRepository.Repository
	authStorage           authStorageRepository.Repository
}

func ServiceNew(subjectCheckinStorage subjectCheckinStorageRepository.Repository, authStorage authStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		subjectCheckinStorage: subjectCheckinStorage,
		authStorage:           authStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
