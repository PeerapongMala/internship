package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"

type MapLanguageFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapLanguageFromCsvOutput struct {
	Language string
}

func (service *serviceStruct) MapLanguageFromCsv(in *MapLanguageFromCsvInput) (*MapLanguageFromCsvOutput, error) {
	var language string
	switch in.Cell {
	case "EN":
		language = constant.English
	case "TH":
		language = constant.Thai
	case "ZH":
		language = constant.Chinese
	}

	if language != "" {
		return &MapLanguageFromCsvOutput{Language: language}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
