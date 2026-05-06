package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	CreateItem(item *constant.ItemRequest) (*constant.ItemResponse, error)
	UpdateItem(item *constant.ItemRequest) (*constant.ItemResponse, error)
	GetItem(id int) (*constant.ItemResponse, error)
	ListItem(pagination *helper.Pagination, filter constant.ItemListFilter) (*[]constant.ItemResponse, error)

	CreateItemBadge(item *constant.ItemBadgeRequest) (*constant.ItemBadgeResponse, error)
	UpdateItemBadge(item *constant.ItemBadgeRequest) (*constant.ItemBadgeResponse, error)
	GetItemBadge(itemId int) (*constant.ItemAndBadgeResponse, error)
	ListItemBadges(pagination *helper.Pagination, filter constant.ItemListFilter) (*[]constant.ItemAndBadgeResponse, error)
}
