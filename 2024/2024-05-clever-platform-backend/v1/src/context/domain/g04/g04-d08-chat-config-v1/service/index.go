package service

import (
	chatConfigStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d08-chat-config-v1/storage/storage-repository"
)

func ServiceNew(chatConfigStorage chatConfigStorage.Repository) ServiceInterface {
	return &serviceStruct{
		chatConfigStorage: chatConfigStorage,
	}
}

type serviceStruct struct {
	chatConfigStorage chatConfigStorage.Repository
}

type APIStruct struct {
	Service ServiceInterface
}
