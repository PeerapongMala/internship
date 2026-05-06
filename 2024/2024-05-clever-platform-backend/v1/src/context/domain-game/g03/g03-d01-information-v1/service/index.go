package service

import (
	informationRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/storage/storage-repository"
)

type serviceStruct struct {
	informationStorage informationRepository.Repository
}

func ServiceNew(informationStorage informationRepository.Repository) ServiceInterface {
	return &serviceStruct{
		informationStorage: informationStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
