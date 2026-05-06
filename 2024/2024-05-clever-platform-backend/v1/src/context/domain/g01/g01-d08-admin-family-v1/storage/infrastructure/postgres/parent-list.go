package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ParentList(search string, pagination *helper.Pagination) ([]*constant.Parent, error) {
	query := `
		SELECT 	
			p.user_id,
			u.title, 
			u.first_name, 
			u.last_name,
			CASE 
				WHEN  a.provider = 'line'  
					THEN  a.subject_id  
					ELSE NULL
			END AS line_id,
			u.created_at
		FROM family.family_member fm
        RIGHT JOIN "user".parent p
        	ON p.user_id = fm.user_id
        INNER JOIN "user".user u
        	ON u.id = p.user_id
        LEFT JOIN auth.auth_oauth a
        	ON a.user_id = p.user_id
        WHERE fm.user_id IS NULL
	`
	args := []interface{}{}
	argsIndex := 1
	if search != "" {
		args = append(args, search)
		searchIdx := []string{"p.user_id", "u.title", "u.first_name", "u.last_name", "a.subject_id"}
		searchConditions := make([]string, len(searchIdx))

		for idx, col := range searchIdx {
			searchConditions[idx] = fmt.Sprintf(`%s ILIKE '%%' || $%d || '%%'`, col, argsIndex)
		}

		query += fmt.Sprintf(` AND (%s) `, strings.Join(searchConditions, " OR "))
		argsIndex++
	}

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
	query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var parents []*constant.Parent
	for rows.Next() {
		parent := constant.Parent{}
		err := rows.StructScan(&parent)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		parents = append(parents, &parent)
	}

	return parents, nil
}
