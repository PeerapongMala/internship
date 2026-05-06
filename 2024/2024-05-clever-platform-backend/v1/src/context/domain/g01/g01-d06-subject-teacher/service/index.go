package service

import (
	subjectTeacherStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/storage/storage-repository"
)

type serviceStruct struct {
	subjectTeacherStorage subjectTeacherStorageRepository.Repository
}

func ServiceNew(subjectTeacherStorage subjectTeacherStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		subjectTeacherStorage: subjectTeacherStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
