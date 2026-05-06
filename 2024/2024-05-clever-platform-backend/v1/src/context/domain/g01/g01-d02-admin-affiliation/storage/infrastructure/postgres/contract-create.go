package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ContractCreate(contract *constant.ContractEntity) (*constant.ContractEntity, error) {
	query := `
		INSERT INTO "school_affiliation"."contract" (
			"school_affiliation_id",	
			"seed_platform_id",
			"seed_project_id",
			"name",
			"start_date",
			"end_date",
			"status",
			"wizard_index",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING *;
	`
	contractEntity := constant.ContractEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		contract.SchoolAffiliationId,
		contract.SeedPlatformId,
		1, // default project
		contract.Name,
		contract.StartDate,
		contract.EndDate,
		contract.Status,
		contract.WizardIndex,
		contract.CreatedAt,
		contract.CreatedBy,
		contract.UpdatedAt,
		contract.UpdatedBy,
	).StructScan(&contractEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &contractEntity, nil
}
