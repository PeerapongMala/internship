package postgres

import (
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d03-redeem-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) CheckCouponIsExist(couponCode string) (*constant.CouponEntity, error) {

	now := time.Now()

	query := `
		SELECT 
			*
		FROM
			coupon.coupon
		WHERE code = $1
		AND $2 between started_at AND ended_at
		AND status = 'published'
		LIMIT 1
	`

	var entity constant.CouponEntity
	err := postgresRepository.Database.QueryRowx(query, couponCode, now).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
