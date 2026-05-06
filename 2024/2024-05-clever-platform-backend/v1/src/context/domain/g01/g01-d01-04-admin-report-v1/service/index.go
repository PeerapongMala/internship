package service

import storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/storage/storage-repository"

type serviceStruct struct {
	adminReportStorage storageRepository.Repository
}

func ServiceNew(adminReportStorage storageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		adminReportStorage: adminReportStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
