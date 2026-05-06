package service

type MapChoiceHintFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapChoiceHintFromCsvOutput struct {
	ChoiceHint string
}

func (service *serviceStruct) MapChoiceHintFromCsv(in *MapChoiceHintFromCsvInput) (*MapChoiceHintFromCsvOutput, error) {
	var choiceHint string
	switch in.Cell {
	case "None":
		choiceHint = "none"
	case "Character length":
		choiceHint = "count"
	}

	if choiceHint != "" {
		return &MapChoiceHintFromCsvOutput{ChoiceHint: choiceHint}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
