package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectTemplateCreate(subjectTemplate *constant.SubjectTemplateEntity) (*constant.Id, error) {
	query := `
		INSERT INTO "grade"."subject_template" (
			"name",
			"subject_id",
			"seed_year_id",
			"status",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by",
			"wizard_index"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
	`
	id := constant.Id{}
	err := postgresRepository.Database.QueryRowx(query,
		subjectTemplate.Name,
		subjectTemplate.SubjectId,
		subjectTemplate.SeedYearId,
		subjectTemplate.Status,
		subjectTemplate.CreatedAt,
		subjectTemplate.CreatedBy,
		subjectTemplate.UpdatedAt,
		subjectTemplate.UpdatedBy,
		subjectTemplate.WizardIndex,
	).StructScan(&id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return &id, err
	}

	return &id, nil
}
