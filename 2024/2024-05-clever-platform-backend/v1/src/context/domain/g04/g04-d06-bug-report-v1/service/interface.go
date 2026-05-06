package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d06-bug-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	BugList(filter *constant.BugFilter, pagination *helper.Pagination) ([]*constant.Bug, error)
	BugGet(bugID int) (*constant.Bug, error)
	BugLogList(bugID int) ([]*constant.BugLog, error)
	BugReportDownloadCSV(filter *constant.BugFilter) ([]byte, error)

	UpdateBugStatus(bugLog *constant.BugLog) error
}
