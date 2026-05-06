package storageRepository

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"

type Repository interface {
	ReportAccessGet(userId string, reportAccess *constant.ReportAccess) error
}
