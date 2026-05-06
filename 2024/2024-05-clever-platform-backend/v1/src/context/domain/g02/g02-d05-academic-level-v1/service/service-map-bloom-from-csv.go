package service

type MapBloomFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapBloomFromCsvOutput struct {
	Bloom int
}

func (service *serviceStruct) MapBloomFromCsv(in *MapBloomFromCsvInput) (*MapBloomFromCsvOutput, error) {
	var bloom int
	switch in.Cell {
	case "Level 1 จดจำ(Remembering)":
		bloom = 1
	case "Level 2 ทำความเข้าใจ(Understanding)":
		bloom = 2
	case "Level 3 ประยุกต์ใช้(Applying)":
		bloom = 3
	case "Level 4 วิเคราะห์(Analyzing)":
		bloom = 4
	case "Level 5 ประเมิน(Evaluating)":
		bloom = 5
	case "Level 6 สร้างสรรค์(Creating)":
		bloom = 6
	}

	if bloom != 0 {
		return &MapBloomFromCsvOutput{Bloom: bloom}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
