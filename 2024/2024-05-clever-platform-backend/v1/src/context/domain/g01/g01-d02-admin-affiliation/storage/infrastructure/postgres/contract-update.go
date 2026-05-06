package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ContractUpdate(tx *sqlx.Tx, contract *constant.ContractEntity) (*constant.ContractEntity, error) {
	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		queryMethod = tx.QueryRowx
	} else {
		queryMethod = postgresRepository.Database.QueryRowx
	}

	baseQuery := `
		UPDATE "school_affiliation"."contract" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if contract.Name != "" {
		query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
		args = append(args, contract.Name)
		argsIndex++
	}
	if contract.SeedPlatformId != nil {
		query = append(query, fmt.Sprintf(` "seed_platform_id" = $%d`, argsIndex))
		args = append(args, contract.SeedPlatformId)
		argsIndex++
	}
	if contract.SeedProjectId != nil {
		query = append(query, fmt.Sprintf(` "seed_project_id" = $%d`, argsIndex))
		args = append(args, contract.SeedProjectId)
		argsIndex++
	}
	if contract.WizardIndex != 0 {
		query = append(query, fmt.Sprintf(` "wizard_index" = $%d`, argsIndex))
		args = append(args, contract.WizardIndex)
		argsIndex++
	}
	if contract.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		args = append(args, contract.Status)
		argsIndex++
	}
	if !contract.StartDate.IsZero() {
		query = append(query, fmt.Sprintf(` "start_date" = $%d`, argsIndex))
		args = append(args, contract.StartDate)
		argsIndex++
	}
	if !contract.EndDate.IsZero() {
		query = append(query, fmt.Sprintf(` "end_date" = $%d`, argsIndex))
		args = append(args, contract.EndDate)
		argsIndex++
	}
	if !contract.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		args = append(args, contract.UpdatedAt)
		argsIndex++
	}
	if contract.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		args = append(args, contract.UpdatedBy)
		argsIndex++
	}

	contractEntity := constant.ContractEntity{}
	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, contract.Id)
	err := queryMethod(baseQuery, args...).StructScan(&contractEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &contractEntity, nil
}
