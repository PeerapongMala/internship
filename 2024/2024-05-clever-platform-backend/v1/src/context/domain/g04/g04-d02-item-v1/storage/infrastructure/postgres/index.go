package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

type ItemRepositoryInterface interface {
	CreateItem(item *constant.ItemRequest) (*constant.ItemResponse, error)
	UpdateItem(item *constant.ItemRequest) (*constant.ItemResponse, error)
	GetItem(id int) (*constant.ItemResponse, error)
	ListItem(pagination *helper.Pagination, filter constant.ItemListFilter) (*[]constant.ItemResponse, error)

	CreateItemBadge(item *constant.ItemBadgeRequest) (*constant.ItemBadgeResponse, error)
	UpdateItemBadge(item *constant.ItemBadgeRequest) (*constant.ItemBadgeResponse, error)
	GetItemBadge(itemId int) (*[]constant.ItemAndBadgeResponse, error)
}

type ItemRepository struct {
	Db *sqlx.DB
}

func NewItemRepository(db *sqlx.DB) *ItemRepository {
	return &ItemRepository{Db: db}
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.Repository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
