package service

import adminReportPermissionStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/storage/storage-repository"

type serviceStruct struct {
	adminReportPermissionStorage adminReportPermissionStorage.Repository
}

func ServiceNew(adminReportPermissionStorage adminReportPermissionStorage.Repository) ServiceInterface {
	return &serviceStruct{
		adminReportPermissionStorage: adminReportPermissionStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
