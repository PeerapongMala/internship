package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectGroupGet(subjectGroupId int) (*constant.SubjectGroupEntity, error) {
	query := `
		SELECT
			"sg"."id",
			"sg"."year_id",
			"sg"."seed_subject_group_id",
			"ssg"."name" as "seed_subject_group_name",
			"sg"."status",
			"sg"."created_at",
			"sg"."created_by",
			"sg"."updated_at",
			"u"."first_name" as "updated_by",
			"sg"."admin_login_as",
			"sg"."full_option",
			"sg"."theme",
			"sg"."url"
		FROM "curriculum_group"."subject_group" sg
		LEFT JOIN "user"."user" u
			ON "sg"."updated_by" = "u"."id"
		LEFT JOIN "curriculum_group"."seed_subject_group" ssg
			ON "sg"."seed_subject_group_id" = "ssg"."id"
		WHERE
			"sg"."id" = $1
	`
	subjectGroupEntity := constant.SubjectGroupEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		subjectGroupId,
	).StructScan(&subjectGroupEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subjectGroupEntity, nil
}
