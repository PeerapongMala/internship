package service

type MapLayoutTypeFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapLayoutTypeFromCsvOutput struct {
	LayoutType string
}

func (service *serviceStruct) MapLayoutTypeFromCsv(in *MapLayoutTypeFromCsvInput) (*MapLayoutTypeFromCsvOutput, error) {
	var layoutType string
	switch in.Cell {
	case "1":
		layoutType = "1"
	case "2":
		layoutType = "2"
	}

	if layoutType != "" {
		return &MapLayoutTypeFromCsvOutput{LayoutType: layoutType}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
