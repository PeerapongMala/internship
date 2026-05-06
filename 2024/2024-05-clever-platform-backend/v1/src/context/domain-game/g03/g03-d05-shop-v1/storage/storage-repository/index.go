package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)
	InventoryCoinGet(tx *sqlx.Tx, studentId string) (*int, error)
	ShopItemGetPrice(tx *sqlx.Tx, shopItemId int) (*int, error)
	InventoryCoinUpdate(tx *sqlx.Tx, studentId string, amount int) error
	ShopTransactionCreate(tx *sqlx.Tx, transaction *constant.TeacherStoreTransactionEntity) error
	InventoryUpdate(inventoryId int, itemId int) error
	InventoryGet(studentId string) (*int, error)
	ShopGetItemId(shopItemId int) (*int, error)
	ShopItemCheckStock(shopItemId int) (*bool, error)
	ShopItemUpdateStock(shopItemId int) error
	AvatarGetPrice(avatarId int) (*int, error)
	PetGetPrice(petId int) (*int, error)
	InventoryAvatarUpdate(tx *sqlx.Tx, inventoryId int, avatarId int) error
	InventoryPetUpdate(tx *sqlx.Tx, inventoryId int, petId int) error
	// Avatar
	AddShopAvatar(c constant.ShopRequest) (r constant.ShopResponse, err error)
	GetShopAvatarLists(studentId string) (r []constant.ShopAvatar, err error)
	GetShopAvatar(studentId string, avatarId int) (r constant.ShopResponse, err error)

	// pet
	GetShopPetLists(studentId string) (r []constant.ShopPet, err error)
	GetShopPet(studentId string, petId int) (r constant.ShopPetResponse, err error)

	// Item with type [badge, frame, coupon]
	AddShopItem(c constant.ShopItemRequest) (r constant.ShopItemResponse, err error)
	UpdateShopItem(c constant.ShopItemRequest) (r constant.ShopItemResponse, err error)
	GetShopItemLists(subjectId int, t string, studentId string, classId int, studyGroupIds []int) (r []constant.ShopItem, err error)
	GetShopItem(c constant.ShopItemRequest) (r constant.ShopItemResponse, err error)

	CurrentClassGet(studentId string) (int, error)
	StudyGroupList(classId int, subjectId int, studentId string) ([]int, error)
	TeacherShopItemGetLimit(shopItemId int) (*int, error)
	TeacherShopItemCaseCountUsage(userId string, shopItemId int) (int, error)
}
