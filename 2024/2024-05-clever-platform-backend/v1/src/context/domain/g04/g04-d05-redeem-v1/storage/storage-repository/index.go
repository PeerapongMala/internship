package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	InsertCoupon(tx *sqlx.Tx, entity *constant.CouponEntity) (insertId int, err error)
	GetCouponList(pagination *helper.Pagination, filter *constant.CouponFilter) ([]constant.CouponListEntity, error)
	GetCouponDataList() ([]constant.CouponEntity, error)
	UpdateCoupon(tx *sqlx.Tx, entity *constant.CouponEntity) error
	GetCouponById(id int) (*constant.CouponEntity, error)
	GetCouponTransactionList(couponId int, pagination *helper.Pagination, filter *constant.CouponTransactionFilter) ([]constant.CouponTransactionListEntity, error)
	GetAvatarList() ([]constant.AvatarEntity, error)
	GetPetList() ([]constant.PetEntity, error)
}
