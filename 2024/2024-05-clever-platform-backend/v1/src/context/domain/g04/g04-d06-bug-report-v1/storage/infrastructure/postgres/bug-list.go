package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d06-bug-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) BugList(filter *constant.BugFilter, pagination *helper.Pagination) ([]*constant.Bug, error) {
	query := `
		SELECT 
			b.id,
			b.created_at,
			b.platform,
			b.type,
			b.description,
			b.browser,
			b.os,
			b.url,
			b.version,
			b.created_by,
			STRING_AGG(r.name, ',') AS role,
			b.priority,
			b.status
		FROM bug.bug_report b
		LEFT JOIN "user".user_role ur
			ON b.created_by = ur.user_id
		LEFT JOIN "user".role r
			ON ur.role_id = r.id
		WHERE TRUE
	`
	argsIndex := 1
	args := []interface{}{}
	if filter.Status != "" {
		argsIndex = 1
		args = append(args, filter.Status)
		query += fmt.Sprintf(` AND b.status = $%d`, argsIndex)
		argsIndex++
	}
	if filter.Platform != "" {
		args = append(args, filter.Platform)
		query += fmt.Sprintf(` AND b.os = $%d`, argsIndex)
		argsIndex++
	}
	if filter.Type != "" {
		args = append(args, filter.Type)
		query += fmt.Sprintf(` AND LOWER(b.type) = $%d`, argsIndex)
		argsIndex++
	}
	if filter.Priority != "" {
		args = append(args, filter.Priority)
		query += fmt.Sprintf(` AND LOWER(b.priority) = $%d`, argsIndex)
		argsIndex++
	}
	if filter.StartDate != "" && filter.EndDate != "" {
		args = append(args, filter.StartDate, filter.EndDate)
		query += fmt.Sprintf(` AND DATE(b.created_at) BETWEEN $%d AND $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
	}
	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "description" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SearchText+"%")
		argsIndex++
	}

	query += fmt.Sprintf(` GROUP BY b.id, b.created_at, b.platform, b.type, b.description, b.browser, b.os, b.url, b.version, b.created_by, b.priority, b.status`)

	if pagination != nil {
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
		query += fmt.Sprintf(`  ORDER BY b.created_at DESC
				OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
	} else {
		query += fmt.Sprintf(` ORDER BY b.created_at DESC`)
	}

	log.Println(query, args)
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
