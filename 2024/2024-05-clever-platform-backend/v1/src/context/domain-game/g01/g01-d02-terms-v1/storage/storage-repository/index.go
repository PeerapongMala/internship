package storageRepository

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g01/g01-d02-terms-v1/constant"

type Repository interface {
	TosAcceptanceCreate(tosAcceptance *constant.TosAcceptanceEntity) error
	TosAcceptanceGet(tosId int, userId string) (*bool, error)
	TosGet(tosId int) (*constant.TosEntity, error)
}
