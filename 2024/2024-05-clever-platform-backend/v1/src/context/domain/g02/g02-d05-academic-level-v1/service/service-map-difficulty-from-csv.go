package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"strings"
)

type MapDifficultyFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapDifficultyFromCsvOutput struct {
	Difficulty string
}

func (service *serviceStruct) MapDifficultyFromCsv(in *MapDifficultyFromCsvInput) (*MapDifficultyFromCsvOutput, error) {
	var difficulty string
	switch strings.ToLower(in.Cell) {
	case "easy":
		difficulty = constant.Easy
	case "medium", "normal":
		difficulty = constant.Medium
	case "hard":
		difficulty = constant.Hard
	}

	if difficulty != "" {
		return &MapDifficultyFromCsvOutput{Difficulty: difficulty}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
