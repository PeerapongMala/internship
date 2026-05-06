package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	ItemCreate(item *constant.ItemRequest) (*constant.ItemResponse, error)
	ItemUpdate(item *constant.ItemRequest) (*constant.ItemResponse, error)
	ItemGet(itemId int) (*constant.ItemResponse, error)
	ItemList(pagination *helper.Pagination, filter constant.ItemListFilter) (*[]constant.ItemResponse, error)
	ItemCaseBulkEdit(in *ItemCaseBulkEditInput) error

	ItemBadgeCreate(request *constant.ItemAndBadgeResponse) (*constant.ItemBadgeResponse, error)
	ItemBadgeUpdate(item *constant.ItemAndBadgeResponse) (*constant.ItemBadgeResponse, error)
	ItemBadgeGet(itemId int) (*constant.ItemAndBadgeResponse, error)
	ListItemBadges(pagination *helper.Pagination, filter constant.ItemListFilter) (*[]constant.ItemAndBadgeResponse, error)
}
