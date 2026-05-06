package service

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	"log"
	"os"
	"strconv"

	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	adminUserAccountRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/storage/storage-repository"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/storage/storage-repository"
	"github.com/pkg/errors"
)

type serviceConfig struct {
	viewableYearPastConfig int
}

type serviceStruct struct {
	repositoryTeacherStudent   storageRepository.RepositoryTeacherStudent
	repositoryStorageAuth      authStorageRepository.Repository
	repositoryAdminUserAccount adminUserAccountRepository.Repository
	cloudStorage               cloudStorage.Repository
	config                     serviceConfig
}

func ServiceTeacherStudentNew(
	repositoryTeacherStudent storageRepository.RepositoryTeacherStudent,
	repositoryStorageAuth authStorageRepository.Repository,
	repositoryAdminUserAccount adminUserAccountRepository.Repository,
	cloudStorage cloudStorage.Repository,
) ServiceTeacherStudentInterface {
	viewableYearPastStr := os.Getenv("VIEWABLE_YEARS_PAST")
	viewableYearPastConfig, err := strconv.Atoi(viewableYearPastStr)
	if err != nil {
		log.Fatalf("%+v", errors.WithStack(err))
	}

	return &serviceStruct{
		repositoryTeacherStudent:   repositoryTeacherStudent,
		repositoryStorageAuth:      repositoryStorageAuth,
		repositoryAdminUserAccount: repositoryAdminUserAccount,
		cloudStorage:               cloudStorage,
		config: serviceConfig{
			viewableYearPastConfig: viewableYearPastConfig,
		},
	}
}

type APIStruct struct {
	Service ServiceTeacherStudentInterface
}
