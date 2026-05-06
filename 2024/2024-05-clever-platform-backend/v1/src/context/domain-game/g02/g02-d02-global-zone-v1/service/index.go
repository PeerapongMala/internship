package service

import (
	globalZoneRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-global-zone-v1/storage/storage-repository"
)

type serviceStruct struct {
	globalZoneStorage globalZoneRepository.Repository
}

func ServiceNew(globalZoneStorage globalZoneRepository.Repository) ServiceInterface {
	return &serviceStruct{
		globalZoneStorage: globalZoneStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
