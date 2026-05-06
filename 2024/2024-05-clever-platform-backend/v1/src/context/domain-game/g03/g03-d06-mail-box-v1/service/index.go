package service

import (
	announceStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/storage/storage-repository"
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
)

func ServiceNew(mailBoxStorage announceStorage.MailBoxRepository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		mailBoxStorage: mailBoxStorage,
		cloudStorage:   cloudStorage,
	}
}

type serviceStruct struct {
	mailBoxStorage announceStorage.MailBoxRepository
	cloudStorage   cloudStorageRepository.Repository
}

type APIStruct struct {
	Service ServiceInterface
}
