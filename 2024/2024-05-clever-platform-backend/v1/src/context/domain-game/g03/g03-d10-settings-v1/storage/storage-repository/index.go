package storageRepository

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d10-settings-v1/constant"

type Repository interface {
	GetAccountInfo(userID string) (*constant.AccountInfo, error)
	GetFamilyInfo(userID string) (*constant.FamilyInfo, error)

	ChangePin(string, string) error
}
