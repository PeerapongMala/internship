package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	// items
	AddShopItem(c constant.ShopItemRequest) (r constant.ShopItemEntity, err error)
	UpdateShopItem(storeItemId int, c constant.ShopItemRequest) (r constant.ShopItemEntity, err error)
	GetShopItem(storeItemId int) (r constant.ShopItemResponse, err error)
	GetShopItemLists(pagination *helper.Pagination, filter *constant.ShopItemListFilter) (r []constant.ShopItemResponse, err error)
	UpdateShopItemStatus(storeItemId int, c constant.ShopItemStatusRequest) (r constant.ShopItemEntity, err error)
	UpdateShopItemStatusBulkEdit(c constant.ShopItemStatusBulkEditRequest, updateBy string) (r []constant.ShopItemEntity, err error)
	GetShopItemTransactionList(pagination *helper.Pagination, filter *constant.ShopItemListFilter, storeItemId int) (r []constant.ShopItemTransactionResponse, err error)
	UpdateShopItemTransactionStatus(transactionId int, c constant.ShopItemTransactionStatusRequest) (r constant.ShopItemTransactionEntity, err error)
	UpdateShopItemTransactionStatusBulkEdit(c constant.ShopItemTransactionStatusBulkEditRequest) (r []constant.ShopItemTransactionEntity, err error)
}
