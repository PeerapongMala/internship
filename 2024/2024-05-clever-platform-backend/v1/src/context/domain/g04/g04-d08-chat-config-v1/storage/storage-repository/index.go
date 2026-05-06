package storagerepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d08-chat-config-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type Repository interface {
	ConfigList(pagination *helper.Pagination) ([]*constant.Config, error)
	UpdateStatus(req *constant.Config) error
}
