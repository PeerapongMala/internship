package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SeedSubjectGroupCreate(seedSubjectGroup *constant.SeedSubjectGroupEntity) error {
	query := `
		INSERT INTO "curriculum_group"."seed_subject_group" (
			"name"
		)	
		VALUES ($1)
 	`
	_, err := postgresRepository.Database.Exec(
		query,
		seedSubjectGroup.Name,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
