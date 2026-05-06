package service

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/storage/storage-repository"
)

func ServiceNew(leaderboardStorage storageRepository.LeaderboardRepository) ServiceInterface {
	return &serviceStruct{
		leaderboardStorage: leaderboardStorage,
	}
}

type serviceStruct struct {
	leaderboardStorage storageRepository.LeaderboardRepository
}

// LeaderboardDelete implements ServiceInterface.

// LeaderboardCreate implements ServiceInterface.
// func (service *serviceStruct) LeaderboardCreate(constant.LeaderboardCreateRequest) {
// 	panic("unimplemented")
// }

type APIStruct struct {
	Service ServiceInterface
}
