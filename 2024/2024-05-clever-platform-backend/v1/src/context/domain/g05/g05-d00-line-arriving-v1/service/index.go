package service

import lineArrivingStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d00-line-arriving-v1/storage/storage-repository"

func ServiceNew(lineArrivingStorage lineArrivingStorage.Repository) ServiceInterface {
	return &serviceStruct{
		lineArrivingStorage: lineArrivingStorage,
	}
}

type serviceStruct struct {
	lineArrivingStorage lineArrivingStorage.Repository
}

type APIStruct struct {
	Service ServiceInterface
}
