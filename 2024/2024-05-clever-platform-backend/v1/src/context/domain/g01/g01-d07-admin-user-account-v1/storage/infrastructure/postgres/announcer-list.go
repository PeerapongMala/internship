package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AnnouncerList(filter *constant.AnnouncerFilter, pagination *helper.Pagination) ([]constant.UserEntity, error) {
	query := `
		SELECT 
			"u1"."id",
			"u1"."email",
			"u1"."title",
			"u1"."first_name",
			"u1"."last_name",
			"u1"."id_number",
			"u1"."image_url",
			"u1"."status",
			"u1"."created_at",
			"u1"."created_by",
			"u1"."updated_at",
			u2."first_name" AS "updated_by",
			"u1"."last_login"
		FROM "school"."school_announcer"
		LEFT JOIN "user"."user" u1
			ON "school"."school_announcer"."user_id" = "u1"."id"
		LEFT JOIN "user"."user" u2
			ON "u1"."updated_by" = "u2"."id"
		WHERE
			TRUE
	`

	args := []interface{}{}
	argsIndex := 1
	if filter.SchoolId != 0 {
		query += fmt.Sprintf(` AND "school"."school_announcer"."school_id" = $%d`, argsIndex)
		args = append(args, filter.SchoolId)
		argsIndex++
	}
	if filter.FirstName != "" {
		query += fmt.Sprintf(` AND "u1"."first_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.FirstName+"%")
		argsIndex++
	}
	if filter.LastName != "" {
		query += fmt.Sprintf(` AND "u1"."last_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.LastName+"%")
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "u1"."status" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Status+"%")
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(` SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	announcers := []constant.UserEntity{}
	for rows.Next() {
		announcer := constant.UserEntity{}
		err := rows.StructScan(&announcer)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		announcers = append(announcers, announcer)
	}

	return announcers, nil
}
