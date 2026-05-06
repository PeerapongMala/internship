package service

type MapLockNextLevelFromCsvInput struct {
	RowNumber    int
	ColumnNumber int
	Cell         string
}

type MapLockNextLevelFromCsvOutput struct {
	LockNextLevel *bool
}

func (service *serviceStruct) MapLockNextLevelFromCsv(in *MapLockNextLevelFromCsvInput) (*MapLockNextLevelFromCsvOutput, error) {
	var lockNextLevel *bool
	switch in.Cell {
	case "Unlock":
		tmp := false
		lockNextLevel = &tmp
	case "Lock":
		tmp := true
		lockNextLevel = &tmp
	}

	if lockNextLevel != nil {
		return &MapLockNextLevelFromCsvOutput{
			LockNextLevel: lockNextLevel,
		}, nil
	}

	return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
		RowNumber:    in.RowNumber,
		ColumnNumber: in.ColumnNumber,
	})
}
