package service

// ==================== Service ==========================
func (service serviceStruct) CheckStudyGroupAccess(studentGroupID int, userID string) (bool, error) {
	isExist, err := service.storage.CheckStudyGroupAccess(studentGroupID, userID)
	if err != nil {
		return isExist, err
	}

	return isExist, nil
}
