package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d07-gamemaster-profile-v1/constant"
	"log"

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
			"u1"."last_login"
		FROM "user"."user" u1
		LEFT JOIN "user"."user" u2 
			ON "u1"."updated_by" = "u2"."id"
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

	return &userEntity, nil
}
