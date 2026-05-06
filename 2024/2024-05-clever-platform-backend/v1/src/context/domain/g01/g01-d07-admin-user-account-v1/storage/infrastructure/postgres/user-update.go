package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UserUpdate(tx *sqlx.Tx, user *constant.UserEntity) (*constant.UserEntity, error) {
	type QueryMethod func(query string, args ...interface{}) *sqlx.Row
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.QueryRowx
		}
		return postgresRepository.Database.QueryRowx
	}()

	baseQuery := `
		UPDATE "user"."user" SET 
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1
	if user.Email != nil {
		query = append(query, fmt.Sprintf(` "email" = $%d`, argsIndex))
		argsIndex++
		args = append(args, user.Email)
	}
	if user.Title != "" {
		query = append(query, fmt.Sprintf(` "title" = $%d`, argsIndex))
		argsIndex++
		args = append(args, user.Title)
	}
	if user.FirstName != "" {
		query = append(query, fmt.Sprintf(` "first_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, user.FirstName)
	}
	if user.LastName != "" {
		query = append(query, fmt.Sprintf(` "last_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, user.LastName)
	}
	if user.ImageUrl != nil {
		query = append(query, fmt.Sprintf(` "image_url" = $%d`, argsIndex))
		argsIndex++
		args = append(args, user.ImageUrl)
	}
	if user.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, user.Status)
	}
	if user.UpdatedAt != nil {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, user.UpdatedAt)
	}
	if user.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, user.UpdatedBy)
	}
	if user.LastLogin != nil {
		query = append(query, fmt.Sprintf(` "last_login" = $%d`, argsIndex))
		argsIndex++
		args = append(args, user.LastLogin)
	}

	userEntity := constant.UserEntity{}
	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		baseQuery = fmt.Sprintf(`
			WITH updated_rows AS (
				%s 
			)
			SELECT
				"updated_rows"."id",
				"updated_rows"."email",
				"updated_rows"."title",
				"updated_rows"."first_name",
				"updated_rows"."last_name",
				"updated_rows"."id_number",
				"updated_rows"."image_url",
				"updated_rows"."status",
				"updated_rows"."created_at",
				"updated_rows"."created_by",
				"updated_rows"."updated_at",
				u."first_name" as "updated_by",
				"updated_rows"."last_login"
			FROM updated_rows
			LEFT JOIN "user"."user" u ON "updated_rows"."updated_by" = u."id"
		`, baseQuery)
		args = append(args, user.Id)
		err := queryMethod(
			baseQuery,
			args...,
		).StructScan(&userEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		return &userEntity, nil
	}

	return user, nil
}
