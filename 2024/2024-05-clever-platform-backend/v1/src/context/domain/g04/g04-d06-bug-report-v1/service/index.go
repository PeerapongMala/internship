package service

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	bugReportStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d06-bug-report-v1/storage/storage-repository"
)

func ServiceNew(bugReportStorage bugReportStorage.Repository, cloudStorage cloudStorage.Repository) ServiceInterface {
	return &serviceStruct{
		bugReportStorage: bugReportStorage,
		cloudStorage:     cloudStorage,
	}
}

type serviceStruct struct {
	bugReportStorage bugReportStorage.Repository
	cloudStorage     cloudStorage.Repository
}

type APIStruct struct {
	Service ServiceInterface
}
