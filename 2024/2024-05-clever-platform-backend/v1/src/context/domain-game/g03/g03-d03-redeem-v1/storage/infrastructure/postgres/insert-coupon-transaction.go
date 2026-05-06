package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d03-redeem-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) InsertCouponTransaction(tx *sqlx.Tx, entity *constant.CouponTransactionEntity) (insertId int, err error) {
	
	query := `
		INSERT INTO coupon.coupon_used_transaction (
			coupon_id,
			student_id,
			status,
			used_at
		)
		VALUES ($1, $2, $3, $4)	
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.CouponId,
		entity.StudentId,
		entity.Status,
		entity.UsedAt,
	).Scan(&insertId)
	
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}