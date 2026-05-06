package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	Porphor5Create(in *Porphor5CreateRequest) error

	Porphor5List(in *Porphor5ListRequest) ([]constant.Porphor5DataEntity, error)
	Porphor5Get(in *Porphor5GetRequest) ([]Porphor5GetResponseData, error)
	Porphor5Update(in *Porphor5UpdateRequest) error

	Porphor6List(in *Porphor6ListRequest, pagination *helper.Pagination) ([]constant.Porphor6Data, error)
	Porphor6Get(in *Porphor6GetRequest) ([]Porphor6GetResponseData, error)
	Porphor6Update(in *Porphor6UpdateRequest) error
}
