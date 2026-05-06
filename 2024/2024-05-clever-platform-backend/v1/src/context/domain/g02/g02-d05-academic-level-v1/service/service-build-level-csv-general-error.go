package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"net/http"
)

type BuildLevelCsvGeneralErrorInput struct {
	RowNumber    int
	ColumnNumber int
}

func (service *serviceStruct) BuildLevelCsvGeneralError(in *BuildLevelCsvGeneralErrorInput) error {
	msg := fmt.Sprintf(`Invalid data at column %d of row %d`, in.ColumnNumber+1, in.RowNumber)
	return helper.NewHttpError(http.StatusBadRequest, &msg)
}
