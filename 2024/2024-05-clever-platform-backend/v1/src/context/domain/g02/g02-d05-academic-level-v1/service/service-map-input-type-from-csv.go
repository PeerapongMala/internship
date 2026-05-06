package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"

type MapInputTypeFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapInputTypeFromCsvOutput struct {
	InputType string
}

func (service *serviceStruct) MapInputTypeFromCsv(in *MapInputTypeFromCsvInput) (*MapInputTypeFromCsvOutput, error) {
	var inputType string

	switch in.Cell {
	case "text":
		inputType = constant.InputTypeText
	case "speech":
		inputType = constant.InputTypeSpeech
	}

	if inputType != "" {
		return &MapInputTypeFromCsvOutput{InputType: inputType}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
