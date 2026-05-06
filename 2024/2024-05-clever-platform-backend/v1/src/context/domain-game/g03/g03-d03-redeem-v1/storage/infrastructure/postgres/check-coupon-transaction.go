package postgres

import (
	"log"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) CheckCouponTransactionExist(userId string, couponId *int) (bool, error) {
	
	query := `
		SELECT 
			count(*)
		FROM
			coupon.coupon_used_transaction
		WHERE coupon_id = $1
		AND student_id = $2
	`

	var count int
	err := postgresRepository.Database.QueryRowx(query, couponId, userId).Scan(&count)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return false, err
	}

	if count > 0 {
		return true, nil
	}

	return false, nil
}