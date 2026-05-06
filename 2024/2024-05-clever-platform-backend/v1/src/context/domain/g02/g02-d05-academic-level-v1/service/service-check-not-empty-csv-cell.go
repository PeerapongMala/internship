package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"net/http"
	"strings"
)

type ParseAndValidateNotEmptyCsvCellInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

func (service *serviceStruct) ParseAndValidateNotEmptyCsvCell(in *ParseAndValidateNotEmptyCsvCellInput) error {
	if strings.TrimSpace(in.Cell) == "" {
		msg := fmt.Sprintf(`Column %d of row %d cannot be emtpy`, in.ColumnNumber, in.RowNumber)
		return helper.NewHttpError(http.StatusBadRequest, &msg)
	}

	return nil
}
