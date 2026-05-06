package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-arriving-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UserCaseGetByEmail(email string) (*constant.UserEntity, error) {
	query := `
		SELECT
			u.*,
			"st"."school_id",
			"s"."code" AS "school_code",
			"s"."image_url" AS "school_image_url",
			"s"."name" AS "school_name"
		FROM "user"."user" u
		LEFT JOIN	
		    "school"."school_teacher" "st" ON "u"."id" = "st"."user_id"
		LEFT JOIN
		    "school"."school" s ON "st"."school_id" = "s"."id"
		WHERE
			"email" = $1
	`
	userEntity := constant.UserEntity{}
	err := postgresRepository.Database.QueryRowx(query, email).StructScan(&userEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &userEntity, nil
}
