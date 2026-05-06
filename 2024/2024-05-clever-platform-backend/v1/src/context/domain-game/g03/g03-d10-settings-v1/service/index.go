package service

import (
	settingsRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d10-settings-v1/storage/storage-repository"
)

type serviceStruct struct {
	settingsStorage settingsRepository.Repository
}

func ServiceNew(settingsStorage settingsRepository.Repository) ServiceInterface {
	return &serviceStruct{
		settingsStorage: settingsStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
