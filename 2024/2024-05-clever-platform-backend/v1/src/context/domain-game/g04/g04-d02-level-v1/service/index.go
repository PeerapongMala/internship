package service

import (
	levelRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/storage/storage-repository"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type serviceStruct struct {
	levelStorage levelRepository.Repository
	cache        *helper.Cache
}

func ServiceNew(levelStorage levelRepository.Repository, cache *helper.Cache) ServiceInterface {
	return &serviceStruct{
		levelStorage: levelStorage,
		cache:        cache,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
