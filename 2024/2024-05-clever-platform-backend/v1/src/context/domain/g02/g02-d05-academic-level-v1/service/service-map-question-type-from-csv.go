package service

import (
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
)

type MapQuestionTypeFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapQuestionTypeFromCsvOutput struct {
	QuestionType string
}

func (service *serviceStruct) MapQuestionTypeFromCsv(in *MapQuestionTypeFromCsvInput) (*MapQuestionTypeFromCsvOutput, error) {
	var questionType string
	switch strings.TrimSpace(in.Cell) {
	case "ปรนัย (Multiple Choice)", "drag-drop":
		questionType = constant.MultipleChoice
	case "จับคู่ (Pairing)", "pair", "group":
		questionType = constant.Group
	case "เรียงลำดับ (Sorting)", "drag-sort":
		questionType = constant.Sort
	case "เติมคำ (Placeholder)", "placeholder", "number-picker":
		questionType = constant.Placeholder
	case "เติมคำ (Input)":
		questionType = constant.Input
	case "การเรียนรู้ (Learn)":
		questionType = constant.Learn
	case "boss":
		questionType = in.Cell
	}

	if questionType != "" {
		return &MapQuestionTypeFromCsvOutput{QuestionType: questionType}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
