package service

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	teacherChatStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/storage/storage-repository"
)

type serviceStruct struct {
	teacherChatStorage teacherChatStorageRepository.RepositoryTeacherChat
	cloudStorage       cloudStorage.Repository
}

func ServiceNew(teacherChatStorage teacherChatStorageRepository.RepositoryTeacherChat, cloudStorage cloudStorage.Repository) ServiceInterface {
	return &serviceStruct{
		teacherChatStorage: teacherChatStorage,
		cloudStorage:       cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
