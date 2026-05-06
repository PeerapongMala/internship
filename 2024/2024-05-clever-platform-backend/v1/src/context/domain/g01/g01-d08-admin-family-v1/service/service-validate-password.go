package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

func (service *serviceStruct) ValidatePassword(userID, password string) (bool, error) {
	passwordHash, err := service.adminFamilyStorage.AuthPasswordGetByUserId(userID)
	if err != nil {
		return false, err
	}

	isMatched := helper.ValidatePassword(*passwordHash, password)

	return isMatched, nil
}
