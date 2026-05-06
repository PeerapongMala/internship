package service

func (service serviceStruct) CheckStudyGroupExist(studentGroupID int) (bool, error) {
	isExist, err := service.storage.CheckStudyGroupExist(studentGroupID)
	if err != nil {
		return isExist, err
	}

	return isExist, err
}
