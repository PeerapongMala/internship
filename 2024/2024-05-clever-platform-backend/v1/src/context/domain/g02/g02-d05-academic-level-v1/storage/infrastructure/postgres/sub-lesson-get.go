package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubLessonGet(subLessonId int) (*constant.SubLessonEntity, error) {
	query := `
		SELECT
			"sl"."id",	
			"sl"."lesson_id",
			"sl"."index",
			"sl"."indicator_id",
			"sl"."name",
			"sl"."status",
			"sl"."created_at",
			"sl"."created_by",
			"slfs"."updated_at",
			"sl"."updated_by",
			"sl"."admin_login_as"
		FROM "subject"."sub_lesson"	sl
		LEFT JOIN "subject"."sub_lesson_file_status" slfs ON "sl"."id" = "slfs"."sub_lesson_id"
		WHERE
			"id" = $1
	`
	subLessonEntity := constant.SubLessonEntity{}
	err := postgresRepository.Database.QueryRowx(query, subLessonId).StructScan(&subLessonEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subLessonEntity, err
}
