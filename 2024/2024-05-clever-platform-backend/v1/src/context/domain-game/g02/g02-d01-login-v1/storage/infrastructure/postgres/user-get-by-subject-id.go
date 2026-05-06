package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) UserGetBySubjectId(subjectId string) (*constant.UserEntity, error) {
	query := `
	SELECT
			"u"."id",
			"u"."email",
			"u"."title",
			"u"."first_name",
			"u"."last_name",
			"u"."id_number",
			"u"."image_url",
			"u"."status",
			"sc"."id" AS "school_id",
			"sc"."code" AS "school_code",
			"sc"."name" AS "school_name",
			"sc"."image_url" AS "school_image"
		FROM	
		    "auth"."auth_oauth" a
		LEFT JOIN
			"user"."user" u
			ON "a"."user_id" = "u"."id"
		LEFT JOIN
		    "school"."school_teacher" st
		    ON "st"."user_id" = "u"."id"
		LEFT JOIN
			"school"."school" sc
			ON "st"."school_id" = "sc"."id"
		WHERE
		    "a"."subject_id" = $1
	`

	userEntity := constant.UserEntity{}
	err := postgresRepository.Database.QueryRowx(query, subjectId).StructScan(&userEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &userEntity, nil
}
