package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectGroupCreate(subjectGroup *constant.SubjectGroupEntity) (*constant.SubjectGroupEntity, error) {
	query := `
		INSERT INTO "curriculum_group"."subject_group" (
			"year_id",
			"seed_subject_group_id",
			"status",
			"created_at",
			"created_by",
		    "admin_login_as",
			"full_option",
			"theme",
			"url"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING *
	`
	subjectGroupEntity := constant.SubjectGroupEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		subjectGroup.YearId,
		subjectGroup.SeedSubjectGroupId,
		subjectGroup.Status,
		subjectGroup.CreatedAt,
		subjectGroup.CreatedBy,
		subjectGroup.AdminLoginAs,
		subjectGroup.FullOption,
		subjectGroup.Theme,
		subjectGroup.Url,
	).StructScan(&subjectGroupEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subjectGroupEntity, nil
}
