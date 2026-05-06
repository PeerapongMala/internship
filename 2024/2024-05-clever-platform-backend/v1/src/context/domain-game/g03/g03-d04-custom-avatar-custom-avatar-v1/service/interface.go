package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"

type ServiceInterface interface {
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
	RewardLogList(in *RewardLogListInput) (*RewardLogListOutput, error)
	CouponUse(in *CouponUseInput) error
}
