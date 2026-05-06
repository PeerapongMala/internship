package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
)

type ServiceInterface interface {
	CouponCreate(in *CouponCreateRequest) error
	CouponList(in *CouponListInput) (*CouponListOutput, error)
	CouponUpdate(in *CouponUpdateRequest) error
	CouponGet(id int) (*constant.CouponEntity, error)
	CouponTransactionList(in *CouponTransactionListInput) (*CouponTransactionListOutput, error)
	CouponBulkEdit(in *CouponBulkEditRequest) error

	CouponDownloadCSV(req *constant.CsvDowloadRequest) ([]byte, error)
	CouponUploadCSV(req *UploadCouponCSVRequest) error
	DropDownList(in *DropDownListInput) (*DropDownListOutput, error)
}
