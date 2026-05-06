package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) FamilyList(filter *constant.FamilyFilter, pagination *helper.Pagination) ([]*constant.FamilyResponse, error) {
	query := `
	WITH countUser AS (
    	SELECT family_id, COUNT(user_id) AS member_count
    	FROM family.family_member
    	GROUP BY family_id
	)
	SELECT DISTINCT ON (f.id)
    	f.id AS family_id,
    	fm.user_id,
    	u.first_name,
    	u.last_name,
    	(SELECT a.subject_id FROM auth.auth_oauth a 
    	 WHERE a.user_id = fm.user_id AND a.provider = 'line' 
    	 LIMIT 1) AS line_id,
    	c.member_count,
    	f.status,
    	f.created_at
		FROM family.family f
		INNER JOIN family.family_member fm
    	ON f.id = fm.family_id AND fm.is_owner = TRUE
		INNER JOIN "user".user u ON u.id = fm.user_id
		LEFT JOIN countUser c ON c.family_id = f.id
		WHERE TRUE
	`

	args := []interface{}{}
	argsIndex := 1
	if filter.FamilyID != 0 {
		args = append(args, filter.FamilyID)
		query += fmt.Sprintf(` AND f.id ILIKE '%%' || $%d || '%%'`, argsIndex)
		argsIndex++
	}
	if filter.UserID != "" {
		args = append(args, filter.UserID)
		query += fmt.Sprintf(` AND fm.user_id ILIKE '%%' || $%d || '%%'`, argsIndex)
		argsIndex++
	}
	if filter.FirstName != "" {
		args = append(args, filter.FirstName)
		query += fmt.Sprintf(` AND u.first_name ILIKE '%%' || $%d || '%%'`, argsIndex)
		argsIndex++
	}
	if filter.LastName != "" {
		args = append(args, filter.LastName)
		query += fmt.Sprintf(` AND u.last_name ILIKE '%%' || $%d || '%%'`, argsIndex)
		argsIndex++
	}
	if filter.LineID != "" {
		args = append(args, filter.LineID)
		query += fmt.Sprintf(` AND a.subject_id ILIKE '%%' || $%d || '%%'`, argsIndex)
		argsIndex++
	}
	if filter.MemberCount != 0 {
		args = append(args, filter.MemberCount)
		query += fmt.Sprintf(` AND c.member_count = $%d`, argsIndex)
		argsIndex++
	}
	if filter.Status != "" {
		args = append(args, filter.Status)
		query += fmt.Sprintf(` AND f.status ILIKE '%%' || $%d || '%%'`, argsIndex)
		argsIndex++
	}
	if filter.StartDate != "" && filter.EndDate != "" {
		args = append(args, filter.StartDate, filter.EndDate)
		query += fmt.Sprintf(` AND DATE(f.created_at) BETWEEN $%d AND $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
	}

	if pagination != nil {
		// args = append(args, pagination.Offset, pagination.Limit)
		// query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)

		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		args = append(args, pagination.Offset, pagination.Limit)
		query += fmt.Sprintf(` ORDER BY f.id, f.created_at DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var families []*constant.FamilyResponse
	for rows.Next() {
		family := constant.FamilyResponse{}
		err := rows.StructScan(&family)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		families = append(families, &family)
	}
	return families, nil
}
