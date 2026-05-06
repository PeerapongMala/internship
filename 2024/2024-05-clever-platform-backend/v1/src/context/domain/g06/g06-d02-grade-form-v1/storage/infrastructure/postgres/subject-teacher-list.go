package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectTeacherList(subjectId int, formId int) ([]constant.AdditionalPersonWithPersonDataEntity, error) {
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
			"subject"."subject_teacher" st
		INNER JOIN "user"."user" u ON "st"."teacher_id" = "u"."id"
		INNER JOIN "school"."school_teacher" sct ON "u"."id" = "sct"."user_id"
		INNER JOIN "grade"."evaluation_form" ef ON "ef"."school_id" = "sct"."school_id"
		LEFT JOIN "user"."user_teacher_access" uta ON "u"."id" = "uta"."user_id"
		WHERE "st"."subject_id" = $1 AND "ef"."id" = $2
		GROUP BY "u"."id"
	`
	teachers := []constant.AdditionalPersonWithPersonDataEntity{}
	err := postgresRepository.Database.Select(&teachers, query, subjectId, formId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return teachers, nil
}
