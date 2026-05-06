package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UserGet(userId string) (*constant.UserEntity, error) {
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
			"u2"."first_name" as "updated_by",
			"u1"."last_login",
			"sc"."id" AS "school_id",
			"sc"."name" AS "school_name",
			"sc"."code" AS "school_code",
			"sc"."image_url" AS "school_image_url"
		FROM "user"."user" u1
		LEFT JOIN "user"."user" u2 
			ON "u1"."updated_by" = "u2"."id"
		LEFT JOIN "school"."school_teacher" st
			ON "u1"."id" = "st"."user_id"
		LEFT JOIN "school"."school" sc
			ON "st"."school_id" = "sc"."id"
		WHERE
			"u1"."id" = $1;
	`
	userEntity := constant.UserEntity{}
	row := postgresRepository.Database.QueryRowx(query, userId)
	err := row.StructScan(&userEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	log.Println(userEntity.ScId)

	return &userEntity, nil
}
