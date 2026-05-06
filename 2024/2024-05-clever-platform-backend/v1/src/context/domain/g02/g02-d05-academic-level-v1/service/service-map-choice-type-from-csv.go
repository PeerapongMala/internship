package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"

type MapChoiceTypeFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapChoiceTypeFromCsvOutput struct {
	ChoiceType string
}

func (service *serviceStruct) MapChoiceTypeFromCsv(in *MapChoiceTypeFromCsvInput) (*MapChoiceTypeFromCsvOutput, error) {
	var choiceType string
	switch in.Cell {
	case "text":
		choiceType = constant.QuestionChoiceTypeTextSpeech
	case "image":
		choiceType = constant.QuestionChoiceTypeImage
	}

	if choiceType != "" {
		return &MapChoiceTypeFromCsvOutput{ChoiceType: choiceType}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
