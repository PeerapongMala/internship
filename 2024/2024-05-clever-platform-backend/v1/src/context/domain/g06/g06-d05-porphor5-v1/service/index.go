package service

import (
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	gradeTemplateRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/storage/storage-repository"
	gradeFormRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/storage/storage-repository"
	gradeDataEntryRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/storage/storage-repository"
	gradePorphor5Repository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/storage/storage-repository"
)

type serviceStruct struct {
	gradeTemplateStorage  gradeTemplateRepository.Repository
	gradeFormStorage      gradeFormRepository.Repository
	gradeDataEntryStorage gradeDataEntryRepository.Repository
	gradePorphor5Storage  gradePorphor5Repository.Repository
	authStorage           authStorageRepository.Repository
	cloudStorage          cloudStorageRepository.Repository
}

func ServiceNew(
	gradeTemplateStorage gradeTemplateRepository.Repository,
	gradeFormStorage gradeFormRepository.Repository,
	gradeDataEntryStorage gradeDataEntryRepository.Repository,
	gradePorphor5Storage gradePorphor5Repository.Repository,
	authStorage authStorageRepository.Repository,
	cloudStorage cloudStorageRepository.Repository,
) ServiceInterface {
	return &serviceStruct{
		gradeTemplateStorage:  gradeTemplateStorage,
		gradeFormStorage:      gradeFormStorage,
		gradeDataEntryStorage: gradeDataEntryStorage,
		gradePorphor5Storage:  gradePorphor5Storage,
		authStorage:           authStorage,
		cloudStorage:          cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
