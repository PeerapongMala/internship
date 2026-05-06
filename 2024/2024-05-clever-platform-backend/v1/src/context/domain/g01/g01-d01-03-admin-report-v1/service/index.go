package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	adminReportRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/storage/storage-repository"
)

type serviceStruct struct {
	adminReportStorage adminReportRepository.Repository
	cloudStorage       cloudStorageRepository.Repository
}

func ServiceNew(adminReportStorage adminReportRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		adminReportStorage: adminReportStorage,
		cloudStorage:       cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
