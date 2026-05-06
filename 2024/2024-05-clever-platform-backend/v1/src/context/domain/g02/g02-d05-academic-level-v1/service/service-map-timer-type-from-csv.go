package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"

type MapTimerTypeFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapTimerTypeFromCsvOutput struct {
	TimerType string
}

func (service *serviceStruct) MapTimerTypeFromCsv(in *MapTimerTypeFromCsvInput) (*MapTimerTypeFromCsvOutput, error) {
	var timerType string
	switch in.Cell {
	case "จับเวลา สามารถเล่นต่อได้เมื่อหมดเวลา":
		timerType = constant.Warn
	case "จับเวลา ไม่สามารถเล่นต่อได้เมื่อหมดเวลา":
		timerType = constant.End
	case "ไม่จับเวลา":
		timerType = constant.No
	}

	if timerType != "" {
		return &MapTimerTypeFromCsvOutput{TimerType: timerType}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
