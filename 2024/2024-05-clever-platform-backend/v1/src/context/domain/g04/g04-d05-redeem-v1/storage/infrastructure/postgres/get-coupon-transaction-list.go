package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetCouponTransactionList(couponId int, pagination *helper.Pagination, filter *constant.CouponTransactionFilter) ([]constant.CouponTransactionListEntity, error) {
	query := `
		SELECT 
			cut.id AS coupon_transaction_id,
			u.id AS user_id,
			s.student_id AS student_id,
			u.title AS title,
			u.first_name AS first_name,
			u.last_name AS last_name,
			s2."name" AS school_name,
			cut.used_at AS used_at,
			cut.recalled_at AS recalled_at,
			cut.status AS status
		FROM coupon.coupon_used_transaction cut 
		LEFT JOIN "user"."user" u 
		ON cut.student_id = u.id
		LEFT JOIN "user".student s 
		ON s.user_id = cut.student_id 
		LEFT JOIN school.school s2 
		ON s.school_id = s2.id
		WHERE cut.coupon_id = $1
	`

	queryBuilder := helper.NewQueryBuilder(query, couponId)
	if filter.UsedAtStart != "" && filter.UsedAtEnd != "" {
		queryBuilder.AddFilter(`AND cut.used_at BETWEEN `, filter.UsedAtStart)
		queryBuilder.AddFilter(`AND `, filter.UsedAtEnd)
	}

	//add search
	searchCol := []string{`u.title`, `u.first_name`, `u.last_name`, `s2."name"`}
	queryBuilder.ApplySearch(searchCol, filter.Search)

	countQuery, countArgs := queryBuilder.GetTotalCountQueryBuild()

	err := postgresRepository.Database.QueryRowx(countQuery, countArgs...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query, args := queryBuilder.Build()
	if pagination != nil && pagination.Limit.Valid {
		query += fmt.Sprintf(` LIMIT %d OFFSET %d`, pagination.Limit.Int64, pagination.Offset)
	}

	entities := []constant.CouponTransactionListEntity{}
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}
