package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	GradPorphor6GetById(studentId string, evaluationFormId string) (*GradePorphor6Response, error)
	GradePorphor6List(request constant.GradePorphor6ListRequest, pagination *helper.Pagination) (*[]constant.Porphor6ListResponse, error)
}
