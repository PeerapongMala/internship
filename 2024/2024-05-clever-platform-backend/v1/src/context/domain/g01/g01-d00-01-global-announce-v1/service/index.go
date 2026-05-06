package service

import (
	announceStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-global-announce-v1/storage/storage-repository"
)

func ServiceNew(announceStorage announceStorage.AnnounceRepository) ServiceInterface {
	return &serviceStruct{
		announceStorage: announceStorage,
	}
}

type serviceStruct struct {
	announceStorage announceStorage.AnnounceRepository
}

type APIStruct struct {
	Service ServiceInterface
}
