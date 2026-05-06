package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ObserverList(pagination *helper.Pagination, filter *constant.ObserverFilter) ([]constant.ObserverWithAccesses, error) {
	query := `
			SELECT DISTINCT
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
				"u1"."last_login",
				aep.user_id IS NOT NULL AS "have_password"
			FROM "user"."user" u1
			LEFT JOIN "user"."user" u2
				ON "u1"."updated_by" = "u2"."id"
			LEFT JOIN "user"."user_role"
				ON "u1"."id" = "user"."user_role"."user_id"
			LEFT JOIN "user"."user_observer_access"
		  		ON u1."id" = "user"."user_observer_access"."user_id"
			LEFT JOIN "auth"."auth_email_password" aep
				ON "u1"."id" = "aep"."user_id"
			WHERE
				"user"."user_role"."role_id" = 4
		`
	accessQuery := `
		SELECT
			"user"."user_observer_access"."observer_access_id",
			"auth"."observer_access".name,
			"auth"."observer_access"."updated_at",
			"u"."first_name" AS "updated_by"	
		FROM "user"."user_observer_access"
		LEFT JOIN "auth"."observer_access"
			ON "user"."user_observer_access"."observer_access_id" = "auth"."observer_access"."id"
		LEFT JOIN "user"."user" u
			ON "auth"."observer_access"."updated_by" = "u"."id"
		WHERE
			"user"."user_observer_access"."user_id" = $1
	`
	args := []interface{}{}
	argsIndex := 1
	if filter.Id != "" {
		query += fmt.Sprintf(` AND "u1"."id" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Id+"%")
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
	if filter.Email != "" {
		query += fmt.Sprintf(` AND "u1"."email" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Email+"%")
		argsIndex++
	}
	if filter.ObserverAccessId != 0 {
		query += fmt.Sprintf(` AND "user"."user_observer_access"."observer_access_id" = $%d`, argsIndex)
		args = append(args, filter.ObserverAccessId)
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "u1"."status" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Status+"%")
		argsIndex++
	}

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

	observers := []constant.ObserverWithAccesses{}
	for rows.Next() {
		observer := constant.ObserverWithAccesses{}
		err := rows.StructScan(&observer)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		rows, err := postgresRepository.Database.Queryx(
			accessQuery,
			observer.Id,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		accesses := []constant.ObserverAccessEntity{}
		for rows.Next() {
			access := constant.ObserverAccessEntity{}
			err := rows.StructScan(&access)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}
			accesses = append(accesses, access)
		}
		observer.ObserverAccesses = accesses
		observers = append(observers, observer)
	}

	return observers, nil
}
