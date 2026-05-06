package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ParentList(filter *constant.UserFilter, pagination *helper.Pagination) ([]constant.ParentDataEntity, error) {
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
			"u2"."first_name" AS "updated_by",
			"u1"."last_login"
		FROM "user"."user" u1
		LEFT JOIN "user"."user" u2 
			ON "u1"."updated_by" = "u2"."id"
		LEFT JOIN "user"."user_role" ur
			ON "u1"."id" = "ur"."user_id"
		WHERE
			TRUE AND 
			"ur"."role_id" = 8
	`

	parentQuery := `
		SELECT * 
		FROM "user".parent 
		WHERE user_id = $1
	`

	args := []interface{}{}
	argsIndex := 1
	if filter.Id != "" {
		query += fmt.Sprintf(` AND "u1"."id" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Id+"%")
		argsIndex++
	}
	if filter.Email != "" {
		query += fmt.Sprintf(` AND "u1"."email" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Email+"%")
		argsIndex++
	}
	if filter.Title != "" {
		query += fmt.Sprintf(` AND "u1"."title" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Title+"%")
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
	if !filter.LastLogin.IsZero() {
		query += fmt.Sprintf(` AND "u1"."last_login" = $%d`, argsIndex)
		args = append(args, filter.LastLogin)
		argsIndex++
	}

	query += fmt.Sprintf(` GROUP BY "u1"."id", "u2"."first_name"`)

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

		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	parentList := []constant.ParentDataEntity{}
	for rows.Next() {
		parent := constant.ParentDataEntity{}
		err := rows.StructScan(&parent.UserEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		rowParent, err := postgresRepository.Database.Queryx(
			parentQuery,
			parent.Id,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		for rowParent.Next() {
			err = rowParent.StructScan(&parent.ParentEntity)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}
		}

		parentList = append(parentList, parent)
	}

	return parentList, err
}
