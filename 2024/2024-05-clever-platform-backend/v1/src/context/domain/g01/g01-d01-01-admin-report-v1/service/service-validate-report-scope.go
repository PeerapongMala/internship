package service

import (
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ValidateReportScopeInput struct {
	ReportType  string
	Scope       string
	ParentScope string
}

func (service *serviceStruct) ValidateReportScope(in *ValidateReportScopeInput) error {
	if !slices.Contains(constant.ScopeList, in.Scope) {
		msg := `Invalid scope`
		return helper.NewHttpError(http.StatusBadRequest, &msg)
	}

	return nil
}
