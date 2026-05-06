package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectGet(subjectId int) (*constant.SubjectEntity, error) {
	query := `
		SELECT
			"s"."id",
			"s"."subject_group_id",
			"s"."name",
			"s"."project",
			"s"."subject_language_type",
			"s"."subject_language",
			"s"."image_url",
			"s"."status",
			"s"."created_at",
			"s"."created_by",
			"s"."updated_at",
			"u"."first_name" AS "updated_by",
			"s"."admin_login_as"
		FROM "subject"."subject" s
		LEFT JOIN "user"."user" u
			ON "s"."updated_by" = "u"."id"
		WHERE
			"s"."id" = $1
	`
	subjectEntity := constant.SubjectEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		subjectId,
	).StructScan(&subjectEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	languagesQuery := `
		SELECT
			"language"
		FROM
			"subject"."subject_translation"
		WHERE
			"subject_id" = $1
	`
	languages := []string{}
	err = postgresRepository.Database.Select(&languages, languagesQuery, subjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	subjectEntity.SubjectTranslationLanguages = languages

	return &subjectEntity, nil
}
