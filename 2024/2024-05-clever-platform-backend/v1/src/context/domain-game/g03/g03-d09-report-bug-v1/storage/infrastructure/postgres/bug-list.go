package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d09-report-bug-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) BugList(userID string, pagination *helper.Pagination) ([]*constant.Bug, error) {
	query := `
		SELECT 
			b.id,
			b.created_at,
			b.type,
			b.description,
			b.created_by,
			b.status
		FROM bug.bug_report b
		WHERE b.created_by = $1
	`

	args := []interface{}{userID}
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
	query += fmt.Sprintf(` 
		OFFSET $2 LIMIT $3
	`)

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var bugs []*constant.Bug
	for rows.Next() {
		bug := constant.Bug{}
		err := rows.StructScan(&bug)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		bugs = append(bugs, &bug)
	}
	return bugs, nil
}
