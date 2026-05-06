package service

import (
	"encoding/json"
	"errors"
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	gradeTemplateRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/storage/storage-repository"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"time"
)

type serviceStruct struct {
	gradeTemplateStorage gradeTemplateRepository.Repository
	authStorage          authStorageRepository.Repository
	cloudStorage         cloudStorageRepository.Repository
}

func ServiceNew(gradeTemplateStorage gradeTemplateRepository.Repository, authStorage authStorageRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		gradeTemplateStorage: gradeTemplateStorage,
		authStorage:          authStorage,
		cloudStorage:         cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}

func (api *APIStruct) validateUpsertGradeGeneralTemplateEntity(req *constant.GradeGeneralTemplateEntity) error {
	if req == nil {
		return nil
	}

	if helper.Deref(req.TemplateType) == "เวลาเรียน" {
		if req.AdditionalData == nil {
			//return errors.New("additional_data required")
			return nil
		}

		data := make(map[string]interface{})
		err := json.Unmarshal(*req.AdditionalData, &data)
		if err != nil {
			return err
		}

		//hours, _ := data["hours"].(float64)
		startDate, _ := data["start_date"].(string)
		endDate, _ := data["end_date"].(string)

		//if hours <= 0 {
		//	return errors.New("hours required")
		//}
		_, err = time.Parse("2006-01-02", startDate)
		if err != nil {
			return errors.New("start_date format error")
		}
		_, err = time.Parse("2006-01-02", endDate)
		if err != nil {
			return errors.New("end_date format error")
		}
	}

	return nil
}
