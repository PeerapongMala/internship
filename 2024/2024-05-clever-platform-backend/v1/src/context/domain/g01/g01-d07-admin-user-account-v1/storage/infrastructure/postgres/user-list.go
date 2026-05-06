package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jackc/pgx/pgtype"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UserList(filter *constant.UserFilter, pagination *helper.Pagination) ([]constant.UserWithRolesEntity, error) {
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
				"u1"."last_login",
				"a"."subject_id" AS "line_user_id",
				ARRAY_AGG("user"."user_role"."role_id") AS roles,	
				aep.user_id IS NOT NULL AS "have_password"
			FROM "user"."user" u1
			LEFT JOIN "user"."user" u2 
				ON "u1"."updated_by" = "u2"."id"
			LEFT JOIN "user"."user_role"
				ON "u1"."id" = "user"."user_role"."user_id"
			LEFT JOIN "auth"."auth_oauth" a
				ON "u1"."id" = "a"."user_id"
				AND "a"."provider" = $1
			LEFT JOIN "auth"."auth_email_password" aep
				ON "u1"."id" = "aep"."user_id"
			WHERE
				TRUE
		`
	args := []interface{}{constant.Line}
	argsIndex := 2
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

	query += fmt.Sprintf(` GROUP BY "u1"."id", "u2"."first_name", "a"."subject_id", "aep".user_id`)

	if filter.Roles != nil {
		query += fmt.Sprintf(` HAVING ARRAY_AGG("user_role"."role_id") @> $%d`, argsIndex)
		args = append(args, filter.Roles)
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

	query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
	argsIndex += 2
	args = append(args, pagination.Offset, pagination.Limit)

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	users := []constant.UserWithRolesEntity{}
	for rows.Next() {
		var roles pgtype.Int4Array
		user := constant.UserWithRolesEntity{}
		err := rows.Scan(
			&user.Id,
			&user.Email,
			&user.Title,
			&user.FirstName,
			&user.LastName,
			&user.IdNumber,
			&user.ImageUrl,
			&user.Status,
			&user.CreatedAt,
			&user.CreatedBy,
			&user.UpdatedAt,
			&user.UpdatedBy,
			&user.LastLogin,
			&user.LineSubjectId,
			&roles,
			&user.HavePassword,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		user.Roles = []int{}
		for _, element := range roles.Elements {
			if element.Status == pgtype.Present {
				user.Roles = append(user.Roles, int(element.Int))
			}
		}
		users = append(users, user)
	}

	return users, err
}
