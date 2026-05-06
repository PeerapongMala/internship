package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ListReportBug(userID string, pagination *helper.Pagination) ([]*constant.BugList, error) {
	query := `
		SELECT 
			br.id as bug_id,
			br.description
		FROM bug.bug_report br
		WHERE br.created_by = $1
		ORDER BY br.created_at DESC
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
	query += fmt.Sprintf(` OFFSET $2 LIMIT $3`)

	bugs := []*constant.BugList{}
	err = postgresRepository.Database.Select(&bugs, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return bugs, nil
}
