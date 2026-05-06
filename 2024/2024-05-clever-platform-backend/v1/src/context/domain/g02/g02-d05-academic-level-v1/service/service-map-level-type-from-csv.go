package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
)

type MapLevelTypeFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapLevelTypeFromCsvOutput struct {
	LevelType string
}

func (service *serviceStruct) MapLevelTypeFromCsv(in *MapLevelTypeFromCsvInput) (*MapLevelTypeFromCsvOutput, error) {
	var levelType string
	switch in.Cell {
	case "แบบฝึกหัดทั่วไป":
		levelType = constant.Test
	case "แบบฝึกหัดท้ายบทเรียนย่อย(ด่านบอส)":
		levelType = constant.SubLessonPostTest
	case "แบบฝึกหัดก่อนเรียน-หลังเรียน", "แบบฝึกหัดก่อนเรียน":
		levelType = constant.PrePostTest
	}

	if levelType != "" {
		return &MapLevelTypeFromCsvOutput{LevelType: levelType}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
