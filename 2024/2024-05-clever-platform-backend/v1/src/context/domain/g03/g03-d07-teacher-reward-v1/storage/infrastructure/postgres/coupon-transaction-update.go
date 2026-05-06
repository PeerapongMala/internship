package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) CouponTransactionUpdate(couponTransactionId int, status string) error {
	query := `
		UPDATE "teacher_item"."coupon_transaction"
		SET "status" = $1
		WHERE "id" = $2
	`
	_, err := postgresRepository.Database.Exec(query, status, couponTransactionId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
	}
	return nil
}
