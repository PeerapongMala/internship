package service

type MapChoiceGridFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapChoiceGridFromCsvOutput struct {
	ChoiceGrid string
}

func (service *serviceStruct) MapChoiceGridFromCsv(in *MapChoiceGridFromCsvInput) (*MapChoiceGridFromCsvOutput, error) {
	var choiceGrid string
	// TODO
	choiceGrid = in.Cell

	if choiceGrid != "" {
		return &MapChoiceGridFromCsvOutput{ChoiceGrid: choiceGrid}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
