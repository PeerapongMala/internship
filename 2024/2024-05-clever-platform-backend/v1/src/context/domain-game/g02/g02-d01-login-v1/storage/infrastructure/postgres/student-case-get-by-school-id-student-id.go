package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentCaseGetBySchoolCodeStudentId(schoolCode, studentId string) (*constant.StudentEntity, error) {
	query := `
		SELECT
			"u"."id" AS "user_id",
			"u"."image_url",
			"u"."status",
			"s"."student_id",
			"s"."school_id",
			"sc"."code" AS "school_code",
			"sc"."name" AS "school_name",
			"sc"."image_url" AS "school_image",
			"f"."id" AS "family_id",	
			"p"."relationship" AS "family_owner",
			"u"."title",
			"u"."first_name",
			"u"."last_name"
		FROM	
			"user"."student" s
		LEFT JOIN
			"user"."user" u
			ON "s"."user_id" = "u"."id"
		LEFT JOIN
			"school"."school" sc
			ON "sc"."id" = "s"."school_id"
		LEFT JOIN
			"family"."family_member" fm
			ON "s"."user_id" = "fm"."user_id"
		LEFT JOIN
			"family"."family" f
			ON "fm"."family_id" = "f"."id"
		LEFT JOIN
			"family"."family_member" fm2
			ON "f"."id" = "fm2"."family_id"
			AND "fm2"."is_owner" = $3 
		LEFT JOIN
			"user"."parent" p
			ON "fm2"."user_id" = "p"."user_id"
		LEFT JOIN
			"game"."game_profile_image" gpi	
			ON "s"."user_id" = "gpi"."student_id" 
		WHERE
		    "sc"."code" = $1
			AND
		    "s"."student_id" = $2
	`

	studentEntity := constant.StudentEntity{}
	err := postgresRepository.Database.QueryRowx(query, schoolCode, studentId, true).StructScan(&studentEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &studentEntity, nil
}
