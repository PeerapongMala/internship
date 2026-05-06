package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetCouponList(pagination *helper.Pagination, filter *constant.CouponFilter) ([]constant.CouponListEntity, error) {

	showStatusQuery := `
		CASE 
			WHEN NOW() > c.ended_at AND (c.status = 'enabled' OR c.status = 'published') THEN 'expired'
			WHEN NOW() <= c.ended_at AND (c.status = 'enabled' OR c.status = 'published') THEN 'published'
			WHEN c.status = 'draft' THEN 'draft'
			ELSE c.status
	END AS show_status
	`

	query := fmt.Sprintf(`
		SELECT 
			c.id,
			c.code,
			c.started_at,
			c.ended_at,
			c.status,
			c.initial_stock,
			%s,
			COUNT(cut.id) AS used_count
		FROM coupon.coupon c
		LEFT JOIN coupon.coupon_used_transaction cut 
		ON cut.coupon_id = c.id
		WHERE 1=1
	`, showStatusQuery)

	closingQuery := `
		GROUP BY c.id, c.code, c.started_at, c.ended_at, c.status , c.initial_stock
		ORDER BY c.id
	`

	queryBuilder := helper.NewQueryBuilder(query)
	if filter.StartedAtStart != "" {
		queryBuilder.AddFilter(` AND c.started_at >= `, filter.StartedAtStart)
	}
	if filter.StartedAtEnd != "" {
		queryBuilder.AddFilter(` AND c.started_at <= `, filter.StartedAtEnd)
	}
	if filter.EnedAtStart != "" {
		queryBuilder.AddFilter(` AND c.ended_at >= `, filter.EnedAtStart)
	}
	if filter.EnedAtEnd != "" {
		queryBuilder.AddFilter(` AND c.ended_at <= `, filter.EnedAtEnd)
	}

	if filter.Status != "" {
		if filter.Status == "published" {
			queryBuilder.AddFilter(`AND (NOW() <= c.ended_at AND (c.status = 'enabled' OR c.status = 'published'))`, nil)
		} else if filter.Status == "expired" {
			queryBuilder.AddFilter(`AND (NOW() > c.ended_at AND (c.status = 'enabled' OR c.status = 'published'))`, nil)
		} else if filter.Status == "draft" {
			queryBuilder.AddFilter(`AND (c.status = 'draft')`, nil)
		} else if filter.Status == "disabled" {
			queryBuilder.AddFilter(`AND (c.status = 'disabled')`, nil)
		} else if filter.Status == "waiting" {
			queryBuilder.AddFilter(`AND (c.status = 'waiting')`, nil)
		}
	}

	//add search
	searchCol := []string{`c.code`}
	queryBuilder.ApplySearch(searchCol, filter.Search)
	queryBuilder.AddClosingQuery(closingQuery)

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

	entities := []constant.CouponListEntity{}
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}

func (postgresRepository *postgresRepository) GetCouponDataList() ([]constant.CouponEntity, error) {
	query := `
		SELECT 
			*
		FROM
			coupon.coupon
		ORDER BY id	
	`

	entities := []constant.CouponEntity{}
	err := postgresRepository.Database.Select(&entities, query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}
