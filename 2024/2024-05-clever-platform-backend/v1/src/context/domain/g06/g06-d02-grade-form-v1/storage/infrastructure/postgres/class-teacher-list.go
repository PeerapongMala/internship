package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassTeacherList(sheetId int) ([]constant.AdditionalPersonWithPersonDataEntity, error) {
	query := `
		SELECT
		    'teacher' AS "user_type",
			"u"."id" AS "user_id",
			"email",
			"title",
			"first_name",
			"last_name",
			ARRAY_AGG(uta.teacher_access_id) FILTER (WHERE uta.teacher_access_id IS NOT NULL) as teacher_roles 
		FROM
			"grade"."evaluation_sheet" es
		INNER JOIN "grade"."evaluation_form" ef ON "es"."form_id" = "ef"."id"
		INNER JOIN "class"."class" c ON "ef"."school_id" = "c"."school_id" AND "ef"."academic_year" = "c"."academic_year"::text AND "ef"."year" = "c"."year" AND "ef"."school_room" = "c"."name"
		INNER JOIN "school"."class_teacher" ct ON "c"."id" = "ct"."class_id"
		INNER JOIN "user"."user" u ON "u"."id" = "ct"."teacher_id"
		LEFT JOIN "user"."user_teacher_access" uta ON "u"."id" = "uta"."user_id"
		WHERE "es"."id" = $1 
		GROUP BY "u"."id"
	`
	teachers := []constant.AdditionalPersonWithPersonDataEntity{}
	err := postgresRepository.Database.Select(&teachers, query, sheetId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return teachers, nil
}
