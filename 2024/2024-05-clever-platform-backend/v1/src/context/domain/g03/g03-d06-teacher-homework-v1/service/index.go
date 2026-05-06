package service

import (
	teacherHomeWorkRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/storage/storage-repository"
)

type serviceStruct struct {
	teacherHomeworkStorage teacherHomeWorkRepository.Repository
}

func ServiceNew(teacherHomeworkStorage teacherHomeWorkRepository.Repository) ServiceInterface {
	return &serviceStruct{
		teacherHomeworkStorage: teacherHomeworkStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
