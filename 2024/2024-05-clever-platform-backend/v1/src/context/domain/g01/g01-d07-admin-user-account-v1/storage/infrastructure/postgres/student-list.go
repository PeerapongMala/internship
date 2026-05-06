package postgres

import (
	"fmt"
	"log"

	authConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentList(filter *constant.StudentFilter, pagination *helper.Pagination) ([]constant.StudentDataWithOAuth, error) {
	query := `
		SELECT
			"s1".*,
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
		FROM "user"."student" s1
		LEFT JOIN "user"."user" u1
			ON "s1"."user_id" = "u1"."id"
		LEFT JOIN "user"."user" u2
			ON "u1"."updated_by" = "u2"."id"
		LEFT JOIN "school"."school" s2
			ON "s1"."school_id" = "s2"."id"
		WHERE
			TRUE	
	`
	oauthQuery := `
		SELECT
			*
		FROM "auth"."auth_oauth"
		WHERE 
			"auth"."auth_oauth"."user_id" = $1
	`
	args := []interface{}{}
	argsIndex := 1
	if filter.StudentId != "" {
		query += fmt.Sprintf(` AND "s1"."student_id" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.StudentId+"%")
		argsIndex++
	}
	if filter.SchoolId != 0 {
		query += fmt.Sprintf(` AND "s1"."school_id" = $%d`, argsIndex)
		args = append(args, filter.SchoolId)
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "u1"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if filter.SchoolCode != "" {
		query += fmt.Sprintf(` AND "s2"."code" = $%d`, argsIndex)
		args = append(args, filter.SchoolCode)
		argsIndex++
	}
	if filter.FirstName != "" {
		query += fmt.Sprintf(` AND "u1"."first_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.FirstName+"%")
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
		args = append(args, pagination.Offset, pagination.Limit)
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	studentDataWithOauthEntities := []constant.StudentDataWithOAuth{}
	for rows.Next() {
		studentDataWithOauthEntity := constant.StudentDataWithOAuth{}
		err := rows.StructScan(&studentDataWithOauthEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		oauthRows, err := postgresRepository.Database.Queryx(
			oauthQuery,
			studentDataWithOauthEntity.Id,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		authOauthEntities := []authConstant.AuthOAuthEntity{}
		for oauthRows.Next() {
			authOauthEntity := authConstant.AuthOAuthEntity{}
			err := oauthRows.StructScan(&authOauthEntity)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}
			authOauthEntities = append(authOauthEntities, authOauthEntity)
		}
		studentDataWithOauthEntity.Oauth = authOauthEntities
		studentDataWithOauthEntities = append(studentDataWithOauthEntities, studentDataWithOauthEntity)
	}

	return studentDataWithOauthEntities, nil
}
