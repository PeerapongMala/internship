package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SeedSubjectGroupGet(id int) (*constant.SeedSubjectGroupEntity, error) {
	query := `
		SELECT
			"ssg"."id",
			"ssg"."name"
		FROM "curriculum_group"."seed_subject_group" ssg
		WHERE
		    "ssg"."id" = $1
	`
	seedSubjectGroup := constant.SeedSubjectGroupEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		id,
	).StructScan(&seedSubjectGroup)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &seedSubjectGroup, nil
}
