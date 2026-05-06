package service

import (
	"log"
	"os"
	"strconv"

	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/storage/storage-repository"
	teacherStudentStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/storage/storage-repository"
	"github.com/pkg/errors"
)

type serviceConfig struct {
	viewableYearPastConfig int
}

type serviceStruct struct {
	repository               storageRepository.Repository
	repositoryTeacherStudent teacherStudentStorageRepository.RepositoryTeacherStudent
	config                   serviceConfig
}

func ServiceTeacherStudentNew(
	repositoryTeacherStudentGroup storageRepository.Repository,
	repositoryTeacherStudent teacherStudentStorageRepository.RepositoryTeacherStudent,
) ServiceInterface {
	viewableYearPastStr := os.Getenv("VIEWABLE_YEARS_PAST")
	viewableYearPastConfig, err := strconv.Atoi(viewableYearPastStr)
	if err != nil {
		log.Fatalf("%+v", errors.WithStack(err))
	}

	return &serviceStruct{
		repository:               repositoryTeacherStudentGroup,
		repositoryTeacherStudent: repositoryTeacherStudent,
		config: serviceConfig{
			viewableYearPastConfig: viewableYearPastConfig,
		},
	}
}

type APIStruct struct {
	Service ServiceInterface
}
