package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentGet(userId string) (*constant.StudentDataEntity, error) {
	query := `
		SELECT
			"user"."student".*,
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
			u2."first_name" as "updated_by",
			"u1"."last_login"
		FROM "user"."student"
		LEFT JOIN "user"."user" u1 
			ON "user"."student"."user_id" = "u1"."id"
		LEFT JOIN "user"."user" u2 
			ON "u1"."updated_by" = "u2"."id"
		WHERE
			"user"."student"."user_id" = $1
	`
	studentDataEntity := constant.StudentDataEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		userId,
	).StructScan(&studentDataEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &studentDataEntity, nil
}
