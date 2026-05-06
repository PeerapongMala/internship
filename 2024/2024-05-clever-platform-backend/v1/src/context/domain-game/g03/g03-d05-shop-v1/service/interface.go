package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"

type ServiceInterface interface {
	// items
	AddShopItem(c constant.ShopItemRequest) (r constant.ShopItemResponse, err error)
	UpdateShopItem(c constant.ShopItemRequest) (r constant.ShopItemResponse, err error)
	GetShopItem(c constant.ShopItemRequest) (r constant.ShopItemResponse, err error)
	GetShopItemLists(c *GetShopItemListRequest) (r []constant.ShopItem, err error)

	// pet
	GetShopPetLists(studentId string) (r []constant.ShopPet, err error)
	GetShopPet(studentId string, petId int) (r constant.ShopPetResponse, err error)

	// avatar
	AddShopAvatar(c constant.ShopRequest) (r constant.ShopResponse, err error)
	GetShopAvatar(studentId string, avatarId int) (r constant.ShopResponse, err error)
	GetShopAvatarLists(studentId string) (r []constant.ShopAvatar, err error)

	ShopItemBuy(in *ShopItemBuyInput) error
	AvatarBuy(in *AvatarBuyInput) error
	PetBuy(in *PetBuyInput) error
}
