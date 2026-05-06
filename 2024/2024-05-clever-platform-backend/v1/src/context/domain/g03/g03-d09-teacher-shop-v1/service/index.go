package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	teacherShopStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/storage/storage-repository"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func ServiceNew(teacherShopStorage teacherShopStorage.TeacherShopRepository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		TeacherShopStorage: teacherShopStorage,
		cloudStorage:       cloudStorage,
	}
}

type serviceStruct struct {
	TeacherShopStorage teacherShopStorage.TeacherShopRepository
	cloudStorage       cloudStorageRepository.Repository
}

type APIStruct struct {
	Service ServiceInterface
}

type TeacherShopListResponse[T any] struct {
	Pagination *helper.Pagination `json:"_pagination"`
	StatusCode int                `json:"status_code"`
	Data       T                  `json:"data"`
	Message    string             `json:"message"`
}

type TeacherShopResponse[T any] struct {
	StatusCode int    `json:"status_code"`
	Data       T      `json:"data"`
	Message    string `json:"message"`
}
