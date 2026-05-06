package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type CustomAvatarRepository interface {
	GetCustomAvatarCharacterById(c constant.GetInventoryAvatarRequest) (r []constant.InventoryAvatarEntity, err error)
	UpdateCustomAvatarCharacterEquipped(c constant.UpdateInventoryAvatarEquippedRequest) (r constant.InventoryAvatarEntity, err error)
	GetCustomAvatarPetById(c constant.GetInventoryAvatarRequest) (r []constant.InventoryAvatarPetEntity, err error)
	UpdateCustomAvatarPetEquipped(c constant.UpdateCustomAvatarPetEquippedRequest) (r constant.InventoryAvatarPetEntity, err error)
	GetCustomAvatarItemBadge(c constant.GetInventoryAvatarItemRequest) (r []constant.InventoryAvatarItemBadgeEntity, err error)
	UpdateCustomAvatarItemBadgeEquipped(c constant.UpdateCustomAvatarItemEquippedRequest) (r constant.InventoryAvatarItemBadgeEntity, err error)
	GetCustomAvatarItemFrame(c constant.GetInventoryAvatarItemRequest) (r []constant.InventoryAvatarItemEntity, err error)
	UpdateCustomAvatarItemFrameEquipped(c constant.UpdateCustomAvatarItemEquippedRequest) (r constant.InventoryAvatarItemEntity, err error)
	GetCustomAvatarItemCoupon(c constant.GetInventoryAvatarItemRequest) (r []constant.InventoryAvatarItemEntity, err error)
	UpdateCustomAvatarItemCouponEquipped(c constant.UpdateCustomAvatarItemEquippedRequest) (r constant.InventoryAvatarItemEntity, err error)
	RewardLogList(userId string, pagination *helper.Pagination) ([]constant.RewardLogEntity, error)
	CouponUse(tx *sqlx.Tx, itemId int, userId string) (*int64, error)
	UpdateTeacherRewardTransaction(tx *sqlx.Tx, itemId int, studentId string) error

	CouponTransactionCreate(tx *sqlx.Tx, itemId int, userId string) error
	BeginTx() (*sqlx.Tx, error)
}
