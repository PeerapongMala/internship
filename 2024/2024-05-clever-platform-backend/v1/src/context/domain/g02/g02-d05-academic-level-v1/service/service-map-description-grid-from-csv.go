package service

type MapDescriptionGridFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapDescriptionGridFromCsvOutput struct {
	DescriptionGrid string
}

func (service *serviceStruct) MapDescriptionGridFromCsv(in *MapDescriptionGridFromCsvInput) (*MapDescriptionGridFromCsvOutput, error) {
	var descriptionGrid string
	// TODO
	descriptionGrid = in.Cell

	if descriptionGrid != "" {
		return &MapDescriptionGridFromCsvOutput{DescriptionGrid: descriptionGrid}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
