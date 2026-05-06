package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
)

type CheckRequiredFieldsInput struct {
	Row int
	Map map[int]interface{}
}

func (service *serviceStruct) CheckRequiredFields(in *CheckRequiredFieldsInput) error {
	for key, value := range in.Map {
		switch value.(type) {
		case int:
			if value != 0 {
				continue
			}
		case string:
			if value != "" {
				continue
			}
		case *int, *string, *bool:
			if value != nil {
				continue
			}
		}
		return service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
			RowNumber:    in.Row + constant.LevelCsvHeaderLines,
			ColumnNumber: key,
		})
	}

	return nil
}
