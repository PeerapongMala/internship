package service

import (
	customAvatarStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/storage/storage-respository"
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
)

func ServiceNew(customAvatarStorage customAvatarStorage.CustomAvatarRepository, cloudStorage cloudStorage.Repository) ServiceInterface {
	return &serviceStruct{
		customAvatarStorage: customAvatarStorage,
		cloudStorage:        cloudStorage,
	}
}

type serviceStruct struct {
	customAvatarStorage customAvatarStorage.CustomAvatarRepository
	cloudStorage        cloudStorage.Repository
}

type APIStruct struct {
	Service ServiceInterface
}

type CustomAvatarResponse struct {
	StatusCode int         `json:"status_code"`
	Message    string      `json:"message"`
	Data       interface{} `json:"data"`
	Error      *error      `json:"error"`
}
