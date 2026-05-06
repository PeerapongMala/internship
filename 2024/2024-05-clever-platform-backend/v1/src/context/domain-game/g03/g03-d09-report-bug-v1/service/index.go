package service

import (
	reportBugRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d09-report-bug-v1/storage/storage-repository"
)

type serviceStruct struct {
	reportBugStorage reportBugRepository.Repository
}

func ServiceNew(reportBugStorage reportBugRepository.Repository) ServiceInterface {
	return &serviceStruct{
		reportBugStorage: reportBugStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
