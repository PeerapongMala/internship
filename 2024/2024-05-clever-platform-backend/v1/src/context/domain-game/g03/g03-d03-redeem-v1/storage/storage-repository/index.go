package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d03-redeem-v1/constant"
	"github.com/jmoiron/sqlx"
)

type RedeemRepository interface {
	BeginTx() (*sqlx.Tx, error)


	CheckCouponIsExist(couponCode string) (*constant.CouponEntity, error)
	CheckCouponTransactionExist(userId string, couponId *int) (bool, error)
	InsertCouponTransaction(tx *sqlx.Tx, entity *constant.CouponTransactionEntity) (insertId int, err error)
	UpdateInventory(tx *sqlx.Tx, input *constant.InventoryDTO) error
	ReduceCouponStockById(tx *sqlx.Tx, id int) error
	InsertRewardLogs(tx *sqlx.Tx, entity *constant.RewardLogEntity) (insertId int, err error)
}
