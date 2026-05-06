package service

type MapLayoutRatioFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapLayoutRatioFromCsvOutput struct {
	LayoutRatio string
}

func (service *serviceStruct) MapLayoutRatioFromCsv(in *MapLayoutRatioFromCsvInput) (*MapLayoutRatioFromCsvOutput, error) {
	var layoutRatio string
	switch in.Cell {
	case "1:1":
		layoutRatio = "1:1"
	case "3:7":
		layoutRatio = "3:7"
	case "7:3":
		layoutRatio = "7:3"
	}

	if layoutRatio != "" {
		return &MapLayoutRatioFromCsvOutput{LayoutRatio: layoutRatio}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
